import React, { useEffect, useState, useRef, useContext } from "react";
import Sidenav, { SideNavType } from "../components/Sidenav";
import Canvas from "../visualisation/Canvas";
import { Node } from "../models/types/Node";
import Button from 'react-bootstrap/Button';
import { SessionContext } from "../sessionContext";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { useNavigate, useLocation } from "react-router-dom";
import { getMindMap } from "../service/mindMapService";
import { getDefaultSession, fetch, login } from "@inrupt/solid-client-authn-browser";
import {
    WebsocketNotification,
} from "@inrupt/solid-client-notifications";
import { generate_uuidv4 } from "../service/utils";
import { AddCoords, getIdsMapping } from "../visualisation/utils";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Line from "../visualisation/Line";
import { Form } from "react-bootstrap";

const defaultBlankDataset: MindMapDataset = {
    id: "",
    created: "",
    links: [],
    nodes: []
}

const Exam: React.FC = () => {
    const d3Container = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const countRef = useRef(0);

    const ref = useRef(null);
    const [height, setHeight] = useState(4000);
    const [disabled, setDisabled] = useState(false);
    const [url, setUrl] = useState('');
    const [width, setWidth] = useState(4000);
    const [dataset, setDataset] = useState<MindMapDataset>(defaultBlankDataset);
    const theme = useContext(SessionContext)
    const [mounted, setMounted] = useState(false); // <-- new state variable
    const wssUrl = new URL(theme.sessionInfo.podUrl);
    wssUrl.protocol = 'wss';
    const [currentProvider, setCurrentProvider] = useState('');

    useEffect(() => {
        setMounted(true); // set the mounted state variable to true after the component mounts
    }, []);

    useEffect(
        () => {
            if (mounted) {
                if (location.state !== null && location.state.id !== null) {
                    setUrl(location.state.id)
                    const socket = new WebSocket(wssUrl, ['solid-0.1']);
                    socket.onopen = function () {
                        this.send(`sub ${location.state.id}`);
                    };
                    socket.onmessage = function (msg) {
                        if (msg.data && msg.data.slice(0, 3) === 'pub') {
                            if (msg.data === `pub ${location.state.id}`) {
                                getMindMap(location.state.id).then((res: any) => {
                                    const myr = res as MindMapDataset;
                                    myr.links = AddCoords(myr.links, getIdsMapping(myr.nodes))
                                    console.log(myr)
                                    setDataset(() => (myr))
                                })
                            }
                        }
                    };
                    // const websocket4 = new WebsocketNotification(
                    //   location.state.id,
                    //   { fetch: fetch }
                    // );
                    // websocket4.on("message", (e: any) => {
                    //   getMindMap(location.state.id).then((res: any) => {
                    //     const myr = res as MindMapDataset;
                    //     myr.links = AddCoords(myr.links, getIdsMapping(myr.nodes))
                    //     console.log(myr)
                    //     setDataset(() => (myr))
                    //   })
                    // });
                    // websocket4.connect();
                    console.log(location.state)
                    getMindMap(location.state.id).then((res: any) => {
                        const myr = res as MindMapDataset;
                        myr.links = AddCoords(myr.links, getIdsMapping(myr.nodes))
                        console.log(myr)
                        setDataset(() => (myr))
                    })
                } else {
                    navigate('/')
                }
            }
        }, [mounted])

    return (
        <div className="App">
            <Sidenav type={SideNavType.CANVAS} />
            <main ref={ref}>
                {/* <svg
                    id="svg-canvas"
                    className="d3-component"
                    width={500}
                    height={550}

                    ref={d3Container}
                >
                    <foreignObject
                        x={100}
                        y={100}
                        width={100}
                        height={100}
                    // x={node.cx - node.title.length * 4}
                    // y={node.cy}
                    // width={node.title.length * 14}
                    // height={node.title.length * 14}
                    >
                        <div>

                            <Form.Control
                                className='modal-input'
                                type="text"
                                value={currentProvider}
                                onChange={(e) => { setCurrentProvider(e.target.value) }}
                            />
                        </div>
                    </foreignObject>
                </svg> */}
                <TransformWrapper
                    disabled={disabled}
                >
                    <Button id="float-btn-add" onClick={() => { console.log("TEST") }} variant="primary">Done</Button>
                    <TransformComponent
                        wrapperStyle={{
                            maxWidth: "100%",
                            maxHeight: "calc(100vh - 50px)",
                        }}
                    >
                        <svg
                            onClick={() => setDisabled(false)}
                            id="svg-canvas"
                            className="d3-component"
                            width={width}
                            height={height}
                            ref={d3Container}
                        >
                            <defs>
                                <marker
                                    id="triangle"
                                    viewBox="0 0 10 10"
                                    refX="30"
                                    refY="5"
                                    markerUnits="strokeWidth"
                                    markerWidth="4"
                                    markerHeight="9"
                                    orient="auto">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#876" />
                                </marker>
                            </defs>
                            {dataset.links.map((link, index) => {
                                return (
                                    <g>
                                        <line
                                            x1={link.source != undefined ? link.source[0] : 0}
                                            y1={link.source != undefined ? link.source[1] : 0}
                                            x2={link.target != undefined ? link.target[0] : 0}
                                            y2={link.target != undefined ? link.target[1] : 0}
                                            id={link.from + "_" + link.to}
                                            stroke="#999"
                                            strokeOpacity="0.6"
                                            strokeWidth="3"
                                            markerEnd="url(#triangle)"
                                        ></line>
                                        <text
                                            x={link.source != undefined && link.target != undefined ?
                                                (link.source[0] + link.target[0]) / 2 : 0}
                                            y={link.source != undefined && link.target != undefined ?
                                                (link.source[1] + link.target[1]) / 2 : 0}
                                        >{link.title}</text>
                                    </g>
                                );
                            })}
                            {dataset.nodes.map((node, index) => {
                                return (
                                    !node.visible ?

                                        <foreignObject
                                            x={(node.cx) - node.title.length * 4}
                                            y={(node.cy) - 10}
                                            width={node.title.length * 7 + 20}
                                            height={40}
                                        // x={node.cx - node.title.length * 4}
                                        // y={node.cy}
                                        // width={node.title.length * 14}
                                        // height={node.title.length * 14}
                                        >
                                            <div>

                                                <Form.Control
                                                    className='modal-input'
                                                    type="text"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        e.preventDefault()
                                                        setDisabled(true)
                                                    }}
                                                    value={currentProvider}
                                                    onChange={(e) => { setCurrentProvider(e.target.value) }}
                                                />
                                            </div>
                                        </foreignObject>

                                        :
                                        <g>
                                            <rect
                                                x={(node.cx) - node.title.length * 4}
                                                y={(node.cy) - 10}
                                                width={node.title.length * 7 + 20}
                                                height={20}
                                                stroke="green"
                                                strokeWidth="2"
                                                strokeOpacity={0.5}
                                                rx="4" ry="4"
                                                id={node.id}
                                                // stroke={contextMenu.nodeId === node.id ? "green" : "orange"}
                                                // onClick={addConnection}
                                                // onTouchStart={handlePointerDown}
                                                // onTouchEnd={handlePointerUp}
                                                // onTouchMove={handlePointerMove}
                                                fill={"#8FBC8F"}
                                            />
                                            <text
                                                x={(node.cx) - node.title.length * 4 + 8}
                                                y={(node.cy) + 5}
                                            >{node.title}
                                            </text>
                                        </g>
                                );
                            })}
                        </svg>
                    </TransformComponent>
                </TransformWrapper>
            </main>
        </div>
    )

};

export default Exam;






