import React, { useEffect, useState, useRef, useContext } from "react";
import Sidenav, { SideNavType } from "../components/Sidenav";
import Canvas from "../visualisation/Canvas";
import { Node } from "../models/types/Node";
import Button from 'react-bootstrap/Button';
import { SessionContext } from "../sessionContext";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { useNavigate, useLocation } from "react-router-dom";
import { createPreparedMindMap, getMindMap } from "../service/mindMapService";
import { getDefaultSession, fetch, login } from "@inrupt/solid-client-authn-browser";
import {
    WebsocketNotification,
} from "@inrupt/solid-client-notifications";
import { generate_uuidv4 } from "../service/utils";
import { AddCoords, getIdsMapping } from "../visualisation/utils";
import { Card, Col, Container, Form, ListGroup, Modal, Pagination, Row, Stack } from "react-bootstrap";
import { getFriendMessages, getProfiles } from "../service/messageService";
import { Profile } from "../models/types/Profile";
import { Message } from "../models/types/Message";
import { MdSend } from "react-icons/md";
import './Messages.css';
import { flushSync } from "react-dom";
import axios from "axios";
import * as d3 from "d3";
import { getEntitiesConnection, getEntityNeighbours, getKeywords, getLabels } from "../service/dbpediaService";
import { FaBackspace, FaInfo, FaMinus, FaPlus } from "react-icons/fa";
import './Creator.css';
import { ResultItem } from "../models/SparqlResults";
import { Connection } from "../models/types/Connection";
import ModalCreatorName from "./ModalCreatorName";
import ModalCreatorSelected from "./ModalCreatorSelected";
import ModalNewCreatorNode from "./ModalNewCreatorNode";
import { TreeNode, addLink } from "./creatorUtils";

const divWidth = 770

const Creator: React.FC = () => {
    const d3Container = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const countRef = useRef(0);

    const ref = useRef(null);
    const [height, setHeight] = useState(1000);
    const [width, setWidth] = useState(500);
    const theme = useContext(SessionContext)
    const [mounted, setMounted] = useState(false); // <-- new state variable

    const [list, setList] = useState<Profile[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [clickedUser, setClickedUser] = useState('')
    const sessionContext = useContext(SessionContext)
    const [currentProvider, setCurrentProvider] = useState<string>('');

    const [searchedKeyword, setSearchedKeyword] = useState('');
    const [results, setResults] = useState<ResultItem[]>([]);

    const [entitiesConections, setEntitiesConections] = useState<any[]>([]);

    const [recommends, setRecommends] = useState<ResultItem[]>([]);

    const [addedEntity, setAddedEntity] = useState<ResultItem | undefined>();


    const [selectedItemsVisible, setSelectedItemsVisible] = useState<boolean>(false);
    const [nameVisible, setNameVisible] = useState<boolean>(false);
    const [aaaaaaaa, setAaaaaaaa] = useState<boolean>(false);
    const [name, setName] = useState('');

    const [node, setNode] = useState<TreeNode>()

    let items: any[] = [];

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        setWidth(window.innerWidth)
        if (location.state !== null && location.state.id !== null) {
        }
    }, []);

    const language = 'cs';

    async function searchKeyword() {
        const keywords = await getKeywords(searchedKeyword)
        if (keywords !== undefined) {
            setResults(keywords)
        }
    }


    async function getRecs(event: any) {
        const selected = results.find((item) => item.entity.value === event)
        if (selected !== undefined) {
            const a = await getEntityNeighbours(selected.entity.value)

            if (a) {
                setNode({
                    value: selected,
                    children: [],
                    parent: undefined
                })
                setRecommends(a)
            }
        }
        console.log(selected)
    }

    async function refreshPath(item: ResultItem) {

        const newTreeNode: TreeNode = {
            value: item,
            children: [],
            parent: node
        }
        setNode(newTreeNode)

        const a = await getEntityNeighbours(item.entity.value)
        if (a) {
            setRecommends(a)
        }
    }


    async function backspace() {
        if (node !== undefined) {
            const lastNode = node.parent
            if (lastNode !== undefined) {
                setNode(lastNode)
                const a = await getEntityNeighbours(lastNode.value.entity.value)
                if (a) {
                    setRecommends(a)
                }

            }
        }
    }

    async function selectItem(item: ResultItem) {
        setAddedEntity(item)
        setEntitiesConections([])

        if (node !== undefined && node.value !== undefined && item !== undefined) {
            const result = await getEntitiesConnection(node.value.entity.value, item.entity.value)
            if (result !== undefined) {
                setEntitiesConections(result)

            }
        }
        setAaaaaaaa(true)
    }

    async function addNewNodeToMindMap(item: ResultItem) {
        console.log(item)
        if (addedEntity !== undefined) {
            addLink(addedEntity, item, node)
        }
    }

    // // function 

    // function createVis(nmb: number) {
    //     const simNodes = JSON.parse(JSON.stringify(nodes))
    //     const simLinks = JSON.parse(JSON.stringify(links))
    //     const simulation = d3.forceSimulation(simNodes)
    //         // @ts-ignore
    //         .force("link", d3.forceLink(simLinks).id(d => d.entity.value))
    //         .force("center", d3.forceCenter(1000 / 2, 1000 / 2))
    //         .force("collide", d3.forceCollide())
    //         .force("charge", d3.forceManyBody().strength(-1000))
    //         .force("x", d3.forceX())
    //         .force("y", d3.forceY())
    //         .stop()
    //         .tick(100)


    //     const mindMapNodes: Node[] = []
    //     const connections: Connection[] = []
    //     simNodes.forEach((item: any) => {
    //         mindMapNodes.push({
    //             id: generate_uuidv4(),
    //             title: item.label.value,
    //             uri: item.entity.value,
    //             description: '',
    //             cx: item.x,
    //             cy: item.y,
    //             visible: true
    //         })
    //     })

    //     let res = new Map()
    //     mindMapNodes.map((x) => {
    //         res.set(x.uri, x.id)
    //     })

    //     simLinks.forEach((item: any) => {
    //         connections.push({
    //             id: generate_uuidv4(),
    //             title: item.type,
    //             from: res.get(item.source.entity.value),
    //             to: res.get(item.target.entity.value),
    //             testable: true
    //         })
    //     })
    //     setaaa(simNodes)
    //     setbbb(simLinks)
    //     createPreparedMindMap(mindMapNodes, connections, name, sessionContext.sessionInfo)
    //     console.log('fdfds')
    // }

    return (
        <div className="App">
            <Sidenav type={SideNavType.COMMON} />
            <main ref={ref}>
                <Button id="float-btn-add" onClick={() => setSelectedItemsVisible(true)} variant="success">Selected</Button>
                {/* <ModalCreatorSelected
                    selectedItemsVisible={selectedItemsVisible}
                    setSelectedItemsVisible={setSelectedItemsVisible}
                    setNameVisible={setNameVisible}
                    nodes={nodes}
                ></ModalCreatorSelected>
                <ModalCreatorName
                    showModal={nameVisible}
                    classUrl={createVis}
                    setModal={setNameVisible}
                ></ModalCreatorName> */}
                <ModalNewCreatorNode
                    recommends={entitiesConections}
                    showModal={aaaaaaaa}
                    classUrl={addNewNodeToMindMap}
                    setModal={setAaaaaaaa}
                ></ModalNewCreatorNode>
                <Container>
                    <Row>
                        <Stack direction="horizontal" gap={2}>
                            <Form.Control
                                type="text"
                                placeholder="Keyword"
                                name="keyword"
                                value={searchedKeyword}
                                onChange={(e) => setSearchedKeyword(e.target.value)}
                            />
                            <Button onClick={searchKeyword}>Search</Button>
                            <Form.Select
                                onChange={(e) => {
                                    getRecs(e.target.value)
                                }}
                                aria-label="Default select example"
                                style={{ maxWidth: '600px' }}
                            >
                                {results.map((item, index) => {
                                    return (
                                        <option key={index} value={item.entity.value}>{item.label.value}</option>
                                    )
                                })}
                            </Form.Select>
                        </Stack>
                    </Row>
                    <Row>
                        <Pagination className="pagination-creator">
                            {(node !== undefined && node.parent !== undefined) &&
                                <Pagination.Item key={generate_uuidv4()}>
                                    {node.parent.value.label.value}
                                </Pagination.Item>
                            }
                            {(node !== undefined && node.parent !== undefined) &&
                                <Pagination.Item key={generate_uuidv4()}>
                                    ...
                                </Pagination.Item>
                            }


                            {(node !== undefined && node.parent !== undefined) &&
                                <Pagination.Item onClick={() => backspace()} key={generate_uuidv4()}>
                                    <FaBackspace></FaBackspace>
                                </Pagination.Item>
                            }

                        </Pagination>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <div className="message-box">
                                {recommends.map((item, index) => {
                                    return (
                                        <div key={index} className={item.type.value === 'http://dbpedia.org/ontology/wikiPageWikiLink' ? 'fckn-div' : 'fckn-div-category'}>
                                            <div className={item.type.value === 'http://dbpedia.org/ontology/wikiPageWikiLink' ? 'creator-div' : 'creator-div-category'}>
                                                <button className={'creator-btn'} onClick={() => refreshPath(item)}>
                                                    {item.label.value}
                                                </button>
                                                <button className="creator-inline-btn" onClick={(e) => { e.stopPropagation(); alert('item') }}>
                                                    <FaInfo></FaInfo>
                                                </button>
                                                <button className="creator-inline-btn" onClick={(e) => { e.stopPropagation(); selectItem(item); }}>
                                                {/* <button className="creator-inline-btn" onClick={(e) => { e.stopPropagation(); }}> */}
                                                    <FaPlus></FaPlus>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Col>
                    </Row>
                    {/* <Row>
                        <svg
                            width={500}
                            height={500}
                        >
                            <defs>
                                <marker
                                    id="triangle"
                                    viewBox="0 0 10 10"
                                    refX="50"
                                    refY="5"
                                    markerUnits="strokeWidth"
                                    markerWidth="4"
                                    markerHeight="9"
                                    orient="auto">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#876" />
                                </marker>
                            </defs>
                            {aaa.map((node, index) => {
                                return (
                                    <circle
                                        cx={node.x}
                                        r={10}
                                        cy={node.y}
                                        fill="orange"
                                    >
                                    </circle>
                                )
                            })}
                            {aaa.map((node, index) => {
                                return (
                                    <text
                                        x={node.x}
                                        r={20}
                                        stroke="green"
                                        y={node.y}
                                    >{node.label.value}
                                    </text>
                                )
                            })}
                            {bbb.map((node, index) => {
                                return (
                                    <line
                                        x1={node.source.x}
                                        x2={node.target.x}
                                        y1={node.source.y}
                                        y2={node.target.y}
                                        stroke={'rgb(255,0,0)'}
                                        markerEnd="url(#triangle)"

                                    />
                                )
                            })}

                        </svg>
                    </Row> */}
                </Container>
            </main>
        </div >
    )

};

export default Creator;
