import React, { useContext, useEffect, useRef, useState } from "react";
import Sidenav from "../components/Sidenav";
import Canvas from "../visualisation/Canvas";
import { SessionContext } from "../sessionContext";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { useLocation, useNavigate } from "react-router-dom";
import { MindMapService } from "../service/mindMapService";
import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    WebsocketNotification,
} from "@inrupt/solid-client-notifications";
import { AddCoords, getIdsMapping } from "../visualisation/utils";
import { Button, Col, Container, Form, Row, Spinner, Stack } from "react-bootstrap";
import { FaBackspace, FaInfo, FaMinus, FaMinusCircle, FaPlus, FaRemoveFormat } from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { ImInfo } from "react-icons/im";
import { AiOutlineClear } from "react-icons/ai";
import { FiSave } from "react-icons/fi";
import { GrGraphQl } from "react-icons/gr";
import { BiTimeFive, BiTrash } from "react-icons/bi";
import { BsNodePlus, BsQuestionSquare } from "react-icons/bs";
import { Node } from "../models/types/Node";
import { getDates, getEntityNeighbours, getKeywords, getSingleReccomends } from "../service/dbpediaService";
import { ResultItem } from "../models/ResultItem";
import ModalNodeCreate from "../visualisation/modals/ModalNodeCreate";
import { generate_uuidv4 } from "../service/utils";
import { Connection } from "../models/types/Connection";
import { MdColorLens, MdDriveFileRenameOutline, MdKeyboardReturn, MdOutlineCancel, MdScreenShare } from "react-icons/md";
import ModalNodeDelete from "../visualisation/modals/ModalNodeDelete";
import ModalNodeDetail from "../visualisation/modals/ModalNodeDetail";
import { CanvasState } from "../visualisation/models/CanvasState";
import { saveAs } from 'file-saver';
import ModalNodeColor from "../visualisation/modals/ModalNodeColor";
import { HistoryItem, HistoryItemType } from "../models/HistoryItem";
import HistoryVisualisation from "../visualisation/HistoryVisualisation";
import { groupDates } from "../visualisation/utiils";
import { HistoryResultItem } from "../models/HistoryResultItem";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

const Browser: React.FC = () => {
    const d3Container = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const countRef = useRef(0);

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [url, setUrl] = useState('');
    const [width, setWidth] = useState(0);
    const [dataset, setDataset] = useState<MindMapDataset>();

    const sessionContext = useContext(SessionContext)
    const [mounted, setMounted] = useState(false); // <-- new state variable
    const wssUrl = new URL(sessionContext.sessionInfo.podUrl);
    wssUrl.protocol = 'wss';

    const [clickedNode, setClickedNode] = useState<Node>();

    const [searchedKeyword, setSearchedKeyword] = useState('');
    const [recommends, setRecommends] = useState<ResultItem[]>([]);
    const [recommendPath, setRecommendPath] = useState<HistoryItem[]>([]);
    const [lastQuery, setLastQuery] = useState<HistoryItem | undefined>(undefined);

    const [creatorVisible, setCreatorVisible] = useState(false); // <-- new state variable
    const [modalNodeCreate, setModalNodeCreate] = useState(false); // <-- new state variable
    const [modalNodeDetail, setModalNodeDetail] = useState(false);
    const [modalNodeDelete, setModalNodeDelete] = useState(false);
    const [modalNodeColor, setModalNodeColor] = useState(false);

    const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.DEFAULT);
    const [clickedLink, setClickedLink] = useState<Connection>();
    const [disabledCanvas, setDisabledCanvas] = useState(false);
    const [findingSimilar, setFindingSimilar] = useState(false);
    const [historyDataset, setHistoryDataset] = useState<HistoryResultItem[]>([]);

    const [datesView, setDatesView] = useState(false); // <-- new state variable

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

    async function createDateView() {
        if (dataset) {
            const dates = await getDates(dataset.nodes)
            if (dates) {
                setHistoryDataset(dates)
                setCreatorVisible(false);
                setDatesView(true)
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
                                setDatesView(false)
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
                        <HistoryVisualisation dataset={historyDataset} />
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
                                    onClick={() => setClickedNode(undefined)}
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
                                            <g>
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
                                            <g>
                                                <rect
                                                    x={(node.cx) - node.title.length * 4}
                                                    y={(node.cy) - 10}
                                                    width={node.title.length * 7 + 20}
                                                    height={20}
                                                    fillOpacity={(canvasState === CanvasState.ADD_CONNECTION) ? (clickedNode?.id === node.id ? 0.25 : 0.9) : 0.9}
                                                    id={node.id}
                                                    strokeWidth={node.id === clickedNode?.id ? 2 : 0.5}
                                                    stroke={node.id === clickedNode?.id ? "black" : node.color}
                                                    rx="4" ry="4"
                                                    fill={node.color}
                                                />
                                                <text
                                                    x={(node.cx) - node.title.length * 4 + 8}
                                                    y={(node.cy) + 5}
                                                    id={node.id}
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

export default Browser;
