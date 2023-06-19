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
import { getEntityNeighbours, getKeywords, getLabels } from "../service/dbpediaService";
import { FaBackspace, FaInfo, FaMinus, FaPlus } from "react-icons/fa";
import './Creator.css';
import { ResultItem } from "../models/SparqlResults";
import { Connection } from "../models/types/Connection";

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

    const [recommends, setRecommends] = useState<ResultItem[]>([]);
    const [path, setPath] = useState<ResultItem[]>([]);


    const [selectedItemsVisible, setSelectedItemsVisible] = useState<boolean>(false);
    const [nameVisible, setNameVisible] = useState<boolean>(false);
    const [name, setName] = useState('');

    const [nodes, setNodes] = useState<any[]>([]);
    const [links, setLinks] = useState<{ source: any; target: any; type: string; }[]>([]);

    const [aaa, setaaa] = useState<any[]>([]);
    const [bbb, setbbb] = useState<any[]>([]);


    let items: any[] = [];

    if (path.length <= 2) {
        items = JSON.parse(JSON.stringify(path))
    } else {
        items = []
        items.push()
    }

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
            setLinks([])
            setNodes([])
            const isInNodes = nodes.find(x => x.entity.value === selected.entity.value)
            if (isInNodes === undefined) {
                setNodes([...nodes, selected])
            }
            if (a) {
                setPath([selected])
                setRecommends(a)
            }
        }
        console.log(selected)
    }

    async function refreshPath(item: ResultItem) {
        const lastElement = path[path.length - 1];
        setPath([...path, item])
        const a = await getEntityNeighbours(item.entity.value)
        if (a) {
            setRecommends(a)
        }
    }

    function isInLinks(source: string, target: string, type: string): boolean {
        let result = false;
        links.forEach((link) => {
            if (link.source === source && link.target === target && link.type === type) {
                result = true
            }
        })
        return result
    }

    async function addLink(addedItem: ResultItem) {
        for (let i = 0; i < path.length - 1; i++) {
            let from: ResultItem = path[i];
            let to: ResultItem = path[i + 1]
            if (!isInLinks(from.entity.value, to.entity.value, to.type.value)) {
                const isPathTargetInNodes = nodes.find((item) => item.entity.value === from.entity.value)
                if (isPathTargetInNodes === undefined) {
                    nodes.push(from)
                }
                const isPathSourceInNodes = nodes.find((item) => item.entity.value === to.entity.value)
                if (isPathSourceInNodes === undefined) {
                    nodes.push(to)
                }
                links.push({ source: from.entity.value, target: to.entity.value, type: to.type.value })
            }
        }

        const isTargetInNodes = nodes.find((item) => item.entity.value === addedItem.entity.value)
        if (isTargetInNodes === undefined) {
            nodes.push(addedItem)
        }
        const lastElement = path[path.length - 1];
        const isSourceInNodes = nodes.find((item) => item.entity.value === lastElement.entity.value)
        if (isSourceInNodes === undefined) {
            nodes.push(lastElement)
        }

        links.push({ source: lastElement.entity.value, target: addedItem.entity.value, type: addedItem.type.value })
    }

    async function backspace() {
        const newLastElement = path[path.length - 2];
        const a = await getEntityNeighbours(newLastElement.entity.value)
        setPath((item) => path.filter((_, index) => index !== path.length - 1))
        if (a) {
            setRecommends(a)
        }
    }

    // function 

    function createVis() {
        const simNodes = JSON.parse(JSON.stringify(nodes))
        const simLinks = JSON.parse(JSON.stringify(links))
        const simulation = d3.forceSimulation(simNodes)
            // @ts-ignore
            .force("link", d3.forceLink(simLinks).id(d => d.entity.value))
            .force("center", d3.forceCenter(1000 / 2, 1000 / 2))
            .force("collide", d3.forceCollide())
            .force("charge", d3.forceManyBody().strength(-1000))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .stop()
            .tick(100)


        const mindMapNodes: Node[] = []
        const connections: Connection[] = []
        simNodes.forEach((item: any) => {
            mindMapNodes.push({
                id: generate_uuidv4(),
                title: item.label.value,
                uri: item.entity.value,
                description: '',
                cx: item.x,
                cy: item.y,
                visible: true
            })
        })

        let res = new Map()
        mindMapNodes.map((x) => {
            res.set(x.uri, x.id)
        })

        simLinks.forEach((item: any) => {
            connections.push({
                id: generate_uuidv4(),
                title: item.type,
                from: res.get(item.source.entity.value),
                to: res.get(item.target.entity.value),
                testable: true
            })
        })
        setaaa(simNodes)
        setbbb(simLinks)
        createPreparedMindMap(mindMapNodes, connections, name, sessionContext.sessionInfo)
        console.log('fdfds')
    }

    return (
        <div className="App">
            <Sidenav type={SideNavType.COMMON} />
            <main ref={ref}>
                <Button id="float-btn-add" onClick={() => setSelectedItemsVisible(true)} variant="success">Selected</Button>
                <Modal
                    show={selectedItemsVisible}
                    onHide={() => setSelectedItemsVisible(false)}
                >
                    <Modal.Header>
                        <Modal.Title>Choose name</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="">
                            {nodes.map((item, index) => {
                                return (
                                    <button key={index} className="creator-btn">
                                        {item.label.value}
                                        {/* <button className="creator-delete-btn" onClick={(e) => { e.stopPropagation(); alert('minus') }}>
                                            <FaMinus></FaMinus>
                                        </button> */}
                                    </button>
                                )
                            })}
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className='my-btn'
                            variant="secondary"
                            onClick={() => setSelectedItemsVisible(false)}
                        >
                            Close
                        </Button>
                        <Button
                            className='my-btn'
                            variant="warning"
                            onClick={() => { setSelectedItemsVisible(false); setNameVisible(true) }}
                        >
                            Done
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={nameVisible}
                    onHide={() => setNameVisible(false)}
                >
                    <Modal.Header>
                        <Modal.Title>Choose name</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Label htmlFor="inputKeyword">Searching keyword:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Title"
                            name="title"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className='my-btn'
                            variant="secondary"
                            onClick={() => setNameVisible(false)}
                        >
                            Close
                        </Button>
                        <Button
                            className='my-btn'
                            variant="warning"
                            onClick={() => createVis()}
                        >
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* {width > divWidth ? ( */}
                {width == width ? (
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
                                {path.length >= 1 && (
                                    <Pagination.Item key={generate_uuidv4()}>
                                        {path[0].label.value}
                                    </Pagination.Item>
                                )}

                                {path.length > 1 && (
                                    <Pagination.Item key={generate_uuidv4()}>
                                        ...
                                    </Pagination.Item>
                                )}
                                {path.length > 1 && (
                                    <Pagination.Item key={generate_uuidv4()}>
                                        {path[path.length - 1].label.value}
                                    </Pagination.Item>
                                )}
                                {path.length > 1 && (
                                    <Pagination.Item onClick={() => backspace()} key={generate_uuidv4()}>
                                        <FaBackspace></FaBackspace>
                                    </Pagination.Item>
                                )}
                            </Pagination>
                        </Row>
                        <Row>
                            <Col sm="12">
                                <div className="message-box">
                                    {recommends.map((item, index) => {
                                        return (
                                            <div key={index} className="fckn-div">

                                                <button className={item.type.value === 'http://dbpedia.org/ontology/wikiPageWikiLink' ? 'creator-btn' : 'creator-btn-category'} onClick={() => refreshPath(item)}>
                                                    {item.label.value}
                                                </button>
                                                <button className="creator-inline-btn" onClick={(e) => { e.stopPropagation(); alert('item') }}>
                                                    <FaInfo></FaInfo>
                                                </button>
                                                <button className="creator-inline-btn" onClick={(e) => { e.stopPropagation(); addLink(item) }}>
                                                    <FaPlus></FaPlus>
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Col>
                        </Row>
                        <Row>
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
                        </Row>
                    </Container>
                ) : (
                    <Container>
                        <Row>
                            <Col sm="12">
                            </Col>
                        </Row>
                    </Container>
                )}
            </main>
        </div >
    )

};

export default Creator;
