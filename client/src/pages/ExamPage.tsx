import React, { useContext, useEffect, useRef, useState } from "react";
import Sidenav from "../components/Sidenav";
import Button from 'react-bootstrap/Button';
import { SessionContext } from "../sessionContext";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { useLocation, useNavigate } from "react-router-dom";
import { MindMapService } from "../service/mindMapService";


import { generate_uuidv4, levenshteinDistance } from "../service/utils";
import { AddCoords, getIdsMapping } from "../visualisation/utils";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Form } from "react-bootstrap";
import { Exam } from "../models/types/Exam";
import { addExamResult } from "../service/examService";

const ExamPage: React.FC = () => {
    const d3Container = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const countRef = useRef(0);

    const ref = useRef(null);
    const [height, setHeight] = useState(4000);
    const [disabled, setDisabled] = useState(false);
    const [url, setUrl] = useState('');
    const [width, setWidth] = useState(4000);
    const [dataset, setDataset] = useState<MindMapDataset>();
    const [fillDataset, setFillDataset] = useState<Map<string, string>>(new Map<string, string>());
    const sessionContext = useContext(SessionContext)
    const [mounted, setMounted] = useState(false); // <-- new state variable
    const wssUrl = new URL(sessionContext.sessionInfo.podUrl);
    wssUrl.protocol = 'wss';
    const [currentProvider, setCurrentProvider] = useState('');

    const mindMapService = new MindMapService();

    async function fetchMindMap(url: string): Promise<void> {
        try {
            const mindMapDataset = await mindMapService.getMindMap(url);
            if (mindMapDataset) {
                mindMapDataset.links = AddCoords(mindMapDataset.links, getIdsMapping(mindMapDataset.nodes))
                setDataset(mindMapDataset)
                updateCanvasAxis(mindMapDataset)
            }
        } catch (error) {
            // Handle the error, e.g., display an error message to the user or perform fallback actions
        }
    }

    useEffect(
        () => {
            if (location.state !== null && location.state.id !== null) {
                fetchMindMap(location.state.id)
            } else {
                navigate('/')
            }
        }, [mounted])

    const updateCanvasAxis = (res: MindMapDataset) => {
        if (res) {
            const xAxes = res.nodes.map((node) => { return node.cx })
            const yAxes = res.nodes.map((node) => { return node.cy })
            if (ref && ref.current) {
                // @ts-ignore
                const mainWidth = ref.current.offsetWidth
                // @ts-ignore
                const mainHeight = ref.current.offsetHeight
                setWidth(Math.max(Math.max(...xAxes) + 250, mainWidth))
                setHeight(Math.max(Math.max(...yAxes) + 250, mainHeight))
            }
        }
    }


    const done = async () => {
        console.log(fillDataset)
        let count = 0;
        let good = 0;

        dataset && dataset.nodes.forEach((item) => {
            if (item.isInTest) {
                count++;
                const distance = levenshteinDistance(item.title.toLowerCase(), fillDataset.get(item.id)!.toLowerCase())
                if (distance < 3) {
                    good++
                }
            }
        })
        const blankProfile: Exam = {
            id: generate_uuidv4(),
            max: count,
            result: good,
            mindMap: location.state.id,
            profile: sessionContext.sessionInfo.webId
        }
        addExamResult(sessionContext.sessionInfo, blankProfile, location.state.class)

    }

    const fillText = (id: string, text: string) => {
        setFillDataset(new Map(fillDataset.set(id, text)));
    }

    return (
        <div className="App">
            <Sidenav />
            <main ref={ref}>
                <TransformWrapper
                    disabled={disabled}
                >
                    <Button id="float-btn-add" onClick={() => done()} variant="primary">Done</Button>
                    <TransformComponent
                        wrapperStyle={{
                            maxWidth: "100%",
                            maxHeight: "calc(100vh - 50px)",
                        }}
                    >
                        <svg
                            onClick={() => setDisabled(false)}
                            id="svg-canvas"
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
                            {dataset && dataset.links.map((link, index) => {
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
                                    </g>
                                );
                            })}
                            {dataset && dataset.nodes.map((node, index) => {
                                return (
                                    node.isInTest ?

                                        <foreignObject
                                            x={(node.cx) - node.title.length * 4}
                                            y={(node.cy) - 10}
                                            width={node.title.length * 7 + 20}
                                            height={40}
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
                                                    value={fillDataset.get(node.id)}
                                                    onChange={(e) => { fillText(node.id, e.target.value) }}
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

export default ExamPage;






