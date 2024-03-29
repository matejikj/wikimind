import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { BiTimeFive } from "react-icons/bi";
import { GrGraphQl } from "react-icons/gr";
import { useLocation, useNavigate } from "react-router-dom";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ModalNodeDetail from "../components/ModalNodeDetail";
import Sidenav from "../components/Sidenav";
import { DBPediaService } from "../dbpedia/dbpediaService";
import { TimelineResultItem } from "../dbpedia/models/TimelineResultItem";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { Node } from "../models/types/Node";
import { MindMapService } from "../service/mindMapService";
import { SessionContext } from "../sessionContext";
import Timeline from "../visualisation/Timeline";
import { AddCoords, getIdsMapping } from "../visualisation/utils";

/**
 * Represents the Browser Page component.
 */
const BrowserPage: React.FC = () => {
    const d3Container = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [dataset, setDataset] = useState<MindMapDataset>();
    const sessionContext = useContext(SessionContext);
    const [clickedNode, setClickedNode] = useState<Node>();
    const [creatorVisible, setCreatorVisible] = useState(false);
    const [modalNodeDetail, setModalNodeDetail] = useState(false);
    const [disabledCanvas, setDisabledCanvas] = useState(false);
    const [historyDataset, setHistoryDataset] = useState<TimelineResultItem[]>([]);
    const [datesView, setDatesView] = useState(false);
    const mindMapService = new MindMapService();
    const dBPeddiaService = new DBPediaService(sessionContext.sessionInfo);

    /**
     * Fetches the mind map data from the server using the provided URL.
     * @param url - The URL of the mind map data.
     */
    async function fetchMindMap(url: string): Promise<void> {
        try {
            const mindMapDataset = await mindMapService.getMindMap(url);
            if (mindMapDataset) {
                mindMapDataset.links = AddCoords(mindMapDataset.links, getIdsMapping(mindMapDataset.nodes));
                setDataset(mindMapDataset);
                const xAxes = mindMapDataset.nodes.map((node) => { return node.cx });
                const yAxes = mindMapDataset.nodes.map((node) => { return node.cy });
                if (ref && ref.current) {
                    // @ts-ignore
                    const mainWidth = ref.current.offsetWidth;
                    // @ts-ignore
                    const mainHeight = ref.current.offsetHeight;
                    setWidth(Math.max(Math.max(...xAxes) + 250, mainWidth));
                    setHeight(Math.max(Math.max(...yAxes) + 250, mainHeight));
                }
            }
        } catch (error) {
            alert(error)
        }
    }

    // Fetch the mind map data when the component mounts or the location state changes
    useEffect(() => {
        if (location.state !== null && location.state.id !== null) {
            fetchMindMap(location.state.id);
        } else {
            navigate('/');
        }
    }, []);

    /**
     * Creates a date view of the mind map data using DBPediaService.
     */
    async function createDateView() {
        if (dataset) {
            const dates = await dBPeddiaService.getDates(dataset.nodes);
            if (dates) {
                setHistoryDataset(dates);
                setCreatorVisible(false);
                setDatesView(true);
            }
        }
    }

    return (
        <div className="App">
            <Sidenav />
            <main className="visualisation-tools" ref={ref}>
                <ModalNodeDetail
                    showModal={modalNodeDetail}
                    setModal={setModalNodeDetail}
                    node={clickedNode}
                />
                <div className={"canvas-full"}>
                    {datesView ? (
                        <Button
                            size="sm"
                            className="rounded-circle"
                            id="visualisation-btn-time-close"
                            onClick={() => {
                                setCreatorVisible(false);
                                setDatesView(false);
                            }}
                            variant="success"><GrGraphQl></GrGraphQl>
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            className="rounded-circle"
                            id="visualisation-btn-time"
                            onClick={() => createDateView()}
                            variant="success"><BiTimeFive></BiTimeFive>
                        </Button>
                    )}
                    {datesView ? (
                        <Timeline dataset={historyDataset} />
                    ) : (
                        <TransformWrapper
                            disabled={disabledCanvas}
                        >
                            <TransformComponent
                                wrapperStyle={{
                                    maxWidth: "100%",
                                    maxHeight: "calc(100dvh - 40px)",
                                }}
                            >
                                <svg
                                    id="svg-canvas"
                                    width={width}
                                    height={height}
                                    ref={d3Container}
                                >
                                    <rect width="100%" height="100%" fill="white" />
                                    <defs>
                                        <marker
                                            id="triangle"
                                            viewBox="0 0 10 10"
                                            refX="5"
                                            refY="5"
                                            markerUnits="strokeWidth"
                                            markerWidth="4"
                                            markerHeight="9"
                                            orient="auto"
                                        >
                                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#876" />
                                        </marker>
                                    </defs>
                                    {dataset && dataset.links.map((link, index) => {
                                        return (
                                            <g key={index}>
                                                <line
                                                    x1={link.source !== undefined ? (link.source[0]) : 0}
                                                    y1={link.source !== undefined ? (link.source[1]) : 0}
                                                    x2={link.target !== undefined && link.source !== undefined ? ((link.target[0]) + (link.source[0])) / 2 : 0}
                                                    y2={link.target !== undefined && link.source !== undefined ? ((link.target[1]) + (link.source[1])) / 2 : 0}
                                                    id={link.from + "_" + link.to}
                                                    stroke="#999"
                                                    strokeOpacity="0.6"
                                                    strokeWidth="2"
                                                    markerEnd="url(#triangle)"
                                                ></line>
                                                <line
                                                    x1={link.target !== undefined && link.source !== undefined ? ((link.target[0]) + (link.source[0])) / 2 : 0}
                                                    y1={link.target !== undefined && link.source !== undefined ? ((link.target[1]) + (link.source[1])) / 2 : 0}
                                                    x2={link.source !== undefined ? (link.target[0]) : 0}
                                                    y2={link.source !== undefined ? (link.target[1]) : 0}
                                                    id={link.from + "_" + link.to}
                                                    stroke="#999"
                                                    strokeOpacity="0.6"
                                                    strokeWidth="2"
                                                ></line>
                                                <line
                                                    x1={link.source !== undefined ? link.source[0] : 0}
                                                    y1={link.source !== undefined ? link.source[1] : 0}
                                                    x2={link.target !== undefined && link.source !== undefined ? (link.target[0] + link.source[0]) / 2 : 0}
                                                    y2={link.target !== undefined && link.source !== undefined ? (link.target[1] + link.source[1]) / 2 : 0}
                                                    id={link.from + "_" + link.to}
                                                    stroke="#999"
                                                    strokeOpacity="0"
                                                    strokeWidth="10"
                                                    onClick={() => alert()}
                                                ></line>
                                                <line
                                                    x1={link.target !== undefined && link.source !== undefined ? (link.target[0] + link.source[0]) / 2 : 0}
                                                    y1={link.target !== undefined && link.source !== undefined ? (link.target[1] + link.source[1]) / 2 : 0}
                                                    x2={link.target !== undefined ? link.target[0] : 0}
                                                    y2={link.target !== undefined ? link.target[1] : 0}
                                                    id={link.from + "_" + link.to}
                                                    stroke="#999"
                                                    strokeOpacity="0"
                                                    strokeWidth="10"
                                                    onClick={() => alert()}
                                                ></line>
                                            </g>
                                        );
                                    })}
                                    {dataset && dataset.nodes.map((node, index) => {
                                        return (
                                            <g key={index}>
                                                <rect
                                                    x={(node.cx) - node.title.length * 3.5}
                                                    y={(node.cy) - 10}
                                                    width={node.title.length * 7 + 10}
                                                    height={20}
                                                    fillOpacity={0.9}
                                                    id={node.id}
                                                    strokeWidth={0.5}
                                                    stroke={node.color}
                                                    rx="4" ry="4"
                                                    onClick={() => {
                                                        setClickedNode(node)
                                                        setModalNodeDetail(true)
                                                    }}
                                                    fill={node.color}
                                                />
                                                <text
                                                    fontSize={14}
                                                    textLength={(node.title.length * 7)}
                                                    alignmentBaseline="middle"
                                                    x={(node.cx) - node.title.length * 3.5 + 5}
                                                    y={(node.cy) + 5}
                                                    id={node.id}
                                                    onClick={() => {
                                                        setClickedNode(node)
                                                        setModalNodeDetail(true)
                                                    }}
                                                    fill={node.textColor}
                                                >{node.title}</text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </TransformComponent>
                        </TransformWrapper>
                    )}
                </div>
            </main>
        </div>
    )
};

export default BrowserPage;
