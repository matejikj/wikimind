import React, { useEffect, useState, useRef, useContext } from "react";
import { IProps } from "../models/types/types";
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
import { Card, Col, Container, Form, ListGroup, Modal, Pagination, Row, Stack } from "react-bootstrap";
import { getFriendMessages, getProfiles } from "../service/messageService";
import { Profile } from "../models/types/Profile";
import { Message } from "../models/types/Message";
import { MdSend } from "react-icons/md";
import './Messages.css';
import { flushSync } from "react-dom";
import axios from "axios";
import * as d3 from "d3";
import { getEntityNeighbours, getLabels } from "../service/dbpediaService";
import { FaBackspace, FaInfo, FaMinus, FaPlus } from "react-icons/fa";
import './Creator.css';
import { ResultItem } from "../models/SparqlResults";

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

    const [formInputs, setFormInputs] = useState('');
    const [results, setResults] = useState<ResultItem[]>([]);

    const [recommends, setRecommends] = useState<ResultItem[]>([]);
    const [path, setPath] = useState<ResultItem[]>([]);


    const [show, setShow] = useState<boolean>(false);
    const [nodes, setNodes] = useState<any[]>([]);
    const [links, setLinks] = useState<{ source: any; target: any; type: string; }[]>([]);


    let items: any[] = [];

    if (path.length <= 2) {
        items = JSON.parse(JSON.stringify(path))
    } else {
        items = []
        items.push()
    }



    // if (path.length <= 2) {
    //     path.forEach()
    // }
    // path.forEach((item) => {
    //     items.push(
    //         <Pagination.Item key={item}>
    //             {item.url.split('http://dbpedia.org/resource/')[1].replace('Category:', '').replaceAll('_', ' ')}
    //         </Pagination.Item>,
    //     );
    // })

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth)
            // console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
        }
        window.addEventListener('resize', handleResize)
        setWidth(window.innerWidth)
        if (location.state !== null && location.state.id !== null) {
        }
    }, []);

    const language = 'cs';

    async function searchKeyword() {
        const url = "https://lookup.dbpedia.org/api/search?label=" + formInputs
        axios.get("https://lookup.dbpedia.org/api/search", {
            params: {
                format: 'json',
                label: formInputs,
            },
            headers: {
                Accept: 'application/json'
            }
        })
            .then(async response => {
                // Handle the response data
                const res: ResultItem[] = response.data.docs.slice(0, 100).map((item: any) => {
                    return {
                        "entity":
                        {
                            "type": "uri",
                            "value": item.resource[0]
                        },
                        "type":
                        {
                            "type": "uri",
                            "value": "http://dbpedia.org/ontology/wikiPageWikiLink"
                        },
                        "label":
                        {
                            "type": "literal",
                            "xml:lang": "en",
                            "value": item.label[0].replaceAll('<B>', '').replaceAll('</B>', '')
                        }
                    }
                })
                const csLabels = await getLabels(res)
                const dict = new Map<string, string>();
                if (csLabels !== undefined) {
                    csLabels.forEach((item) => {
                        dict.set(item.entity.value, item.label.value)
                    })
                }
                res.forEach((item) => {
                    const newLabel = dict.get(item.entity.value)
                    if (newLabel !== undefined) {
                        item.label.value = newLabel
                        item.label["xml:lang"] = 'cs'
                    }
                })
                setResults(res)
                console.log(results)
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });
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
                // nodes.push(root)
            }

            if (a) {
                setPath([selected])
                setRecommends(a)
            }

        }
        console.log(selected)

    }

    async function refreshPath(item: ResultItem) {
        // console.log(bb)

        const lastElement = path[path.length - 1];

        // const isInNodes = nodes.find(x => x.url === event.url)
        // if (isInNodes === undefined) {
        //     nodes.push(event)
        // }

        // if (!nodes.includes(event)) {
        //     nodes.push(event)
        // }




        // setLinks([...links, ])

        setPath([...path, item])
        const a = await getEntityNeighbours(item.entity.value)
        if (a) {
            setRecommends(a)
        }
        // setRecommends([{
        //     url: 'http://dbpedia.org/resource/tretre',
        //     type: 'tretre'
        // }])
        // console.log('RES')
        // console.log({ source: lastElement.url, target: event.url, type: event.type })
        // console.log(event)
    }

    async function addLink(to: ResultItem) {
        const isInNodes = nodes.find((item) => item.entity.value === to.entity.value)
        if (isInNodes === undefined) {
            nodes.push(to)
        }
        const lastElement = path[path.length - 1];

        links.push({ source: lastElement.entity.value, target: to.entity.value, type: to.type.value })



        // const lastElement = path[path.length - 1];
        // if (!nodes.includes(lastElement)) {
        //     nodes.push(lastElement)
        // }
        // if (!nodes.includes(to)) {
        //     nodes.push(to)
        // }

        // //  @ts-ignore
        // const simulation = d3.forceSimulation(aaa)
        //     // @ts-ignore
        //     .force("link", d3.forceLink(bbb).id(d => d.id))
        //     .force("center", d3.forceCenter(800 / 2, 600 / 2))
        //     .force("charge", d3.forceManyBody().strength(-400))
        //     .force("x", d3.forceX())
        //     .force("y", d3.forceY());

        // setA(aaa)
        // setB(bbb)
        // const t = simulation.alphaTarget(0)
        // console.log(aaa)
        // console.log(bbb)
    }

    async function backspace() {
        const newLastElement = path[path.length - 2];
        const a = await getEntityNeighbours(newLastElement.entity.value)
        setPath((item) => path.filter((_, index) => index !== path.length - 1))
        if (a) {
            setRecommends(a)
        }

    }

    function createVis() {

        // const simulation = d3.forceSimulation(nodes)
        //     // @ts-ignore
        //     .force("link", d3.forceLink(links).id(d => d.url))
        //     .force("center", d3.forceCenter(800 / 2, 600 / 2))
        //     .force("charge", d3.forceManyBody().strength(-400))
        //     .force("x", d3.forceX())
        //     .force("y", d3.forceY());

    }

    return (
        <div className="App">
            <Sidenav type={SideNavType.COMMON} />
            <main ref={ref}>
                <Button id="float-btn-add" onClick={() => setShow(true)} variant="success">Selected</Button>
                <Modal
                    show={show}
                    onHide={() => setShow(false)}
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
                            onClick={() => setShow(false)}
                        >
                            Close
                        </Button>
                        <Button
                            className='my-btn'
                            variant="warning"
                            onClick={() => createVis()}
                        >
                            Done
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
                                    value={formInputs}
                                    onChange={(e) => setFormInputs(e.target.value)}
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
                        {/* <Row>
                            <svg
                                width={800}
                                height={600}
                            >
                                {nodes.map((node, index) => {
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
                                {nodes.map((node, index) => {
                                    return (
                                        <text
                                            x={node.x}
                                            r={20}
                                            stroke="green"
                                            y={node.y}
                                        >{node.url}
                                        </text>
                                    )
                                })}
                                {links.map((node, index) => {
                                    return (
                                        <line
                                            x1={node.source.x}
                                            x2={node.target.x}
                                            y1={node.source.y}
                                            y2={node.target.y}
                                            stroke={'rgb(255,0,0)'}
                                        />
                                    )
                                })}

                            </svg>
                        </Row> */}
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
