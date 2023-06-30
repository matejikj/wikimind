import React, { useContext, useEffect, useRef, useState } from "react";
import Sidenav, { SideNavType } from "../components/Sidenav";
import Button from 'react-bootstrap/Button';
import { SessionContext } from "../sessionContext";
import { useLocation, useNavigate } from "react-router-dom";


import { generate_uuidv4 } from "../service/utils";
import { Col, Container, Form, Pagination, Row, Stack } from "react-bootstrap";
import { Profile } from "../models/types/Profile";
import { Message } from "../models/types/Message";
import { getEntitiesConnection, getEntityNeighbours, getKeywords } from "../service/dbpediaService";
import { FaBackspace, FaInfo, FaPlus } from "react-icons/fa";
import { ResultItem } from "../models/ResultItem";
import ModalCreatorName from "../components/ModalCreatorName";
import ModalCreatorSelected from "../components/ModalCreatorSelected";
import ModalNewCreatorNode from "../components/ModalNewCreatorNode";
import { TreeNode, addLink, bfs } from "../service/creatorUtils";

import '../styles/style.css';
import { Connection } from "../models/types/Connection";
import { Node } from "../models/types/Node";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { AddCoords, getIdsMapping } from "../visualisation/utils";

const divWidth = 770

const Creator: React.FC = () => {
    const d3Container = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const countRef = useRef(0);

    const navRef = useRef(null);
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

    const [entitiesConections, setEntitiesConections] = useState<any[]>([]);

    const [recommends, setRecommends] = useState<ResultItem[]>([]);


    const [nodes, setNodes] = useState<Node[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);

    const [addedEntity, setAddedEntity] = useState<ResultItem | undefined>();


    const [selectedItemsVisible, setSelectedItemsVisible] = useState<boolean>(false);
    const [nameVisible, setNameVisible] = useState<boolean>(false);
    const [aaaaaaaa, setAaaaaaaa] = useState<boolean>(false);
    const [name, setName] = useState('');

    const [node, setNode] = useState<TreeNode>()
    const [roots, setRoots] = useState<TreeNode[]>([])

    async function searchKeyword() {
        const keywords = await getKeywords(searchedKeyword)
        if (keywords !== undefined) {
            setRecommends(keywords)
        }
        setNode(undefined)
    }



    async function refreshPath(item: ResultItem) {
        if (node !== undefined) {
            const isAddedInNode = node.children.find((child) => (
                child.value.entity.value === item.entity.value &&
                child.value.label.value === item.label.value
            ))

            if (isAddedInNode !== undefined) {
                setNode(isAddedInNode)

            } else {
                const newTreeNode: TreeNode = {
                    value: item,
                    children: [],
                    parent: node
                }

                node.children.push(newTreeNode)

                setNode(newTreeNode)

            }
        } else {
            const newTreeNode: TreeNode = {
                value: item,
                children: [],
                parent: undefined
            }
            setNode(newTreeNode)
            roots.push(newTreeNode)
        }
        const a = await getEntityNeighbours(item.entity.value)
        if (a) {
            setRecommends(a)
        }

        refreshVis()
    }


    async function backspace() {
        if (node !== undefined) {
            if (node.parent !== undefined) {
                if (node.children.length === 0) {
                    node.parent.children = []
                }
                setNode(node.parent)
                const a = await getEntityNeighbours(node.parent.value.entity.value)
                if (a) {
                    setRecommends(a)
                }
            } else {
                // vyresit kdyz nemam deti ani rodice
                // if (node.children.length === 0) {
                //     node.parent.children = []
                // }

            }
            refreshVis()
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
        if (addedEntity !== undefined && node !== undefined) {
            addLink(addedEntity, item, node)
        }
    }

    // // function 
    function refreshVis() {
        if (roots !== undefined) {
            const a = bfs(roots)
            setNodes(a.nodes)
            let links = AddCoords(a.links, getIdsMapping(a.nodes))
            setConnections(links)
        }
    }

    function createVis() {
        console.log('fdsfsd')
    }

    return (
        <div ref={navRef} className="App">
            <Sidenav type={SideNavType.COMMON} />
            <main>
                <Button id="creator-btn-add" onClick={() => setSelectedItemsVisible(true)} variant="success">Selected</Button>
                <ModalCreatorSelected
                    selectedItemsVisible={selectedItemsVisible}
                    setSelectedItemsVisible={setSelectedItemsVisible}
                    setNameVisible={setNameVisible}
                    roots={roots}
                ></ModalCreatorSelected>
                <ModalCreatorName
                    showModal={nameVisible}
                    classUrl={createVis}
                    setModal={setNameVisible}
                ></ModalCreatorName>
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
                        </Stack>
                    </Row>
                </Container>
                <div className="creator-top">
                    <Container>
                        <Row>
                            {(node !== undefined) &&
                                <Stack direction="horizontal" gap={2}>
                                    <Button>
                                        {node.value.label.value}
                                    </Button>
                                    <Button onClick={() => backspace()}><FaBackspace></FaBackspace></Button>
                                </Stack>
                            }
                        </Row>
                        <Row>
                            <Col sm="12">
                                <div className="message-box">
                                    {(recommends.length !== 0) &&
                                        <div className={'fckn-div'}>
                                            <div className={'creator-div'}>
                                                <button
                                                    className="creator-btn"
                                                    onClick={(e) => { e.stopPropagation(); }}
                                                >
                                                    Add custom
                                                </button>
                                            </div>
                                        </div>
                                    }
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
                    </Container>

                </div>
                <div className="creator-bottom">
                    <TransformWrapper
                        disabled={false}
                    >
                        <TransformComponent
                            wrapperStyle={{
                                maxWidth: "100%",
                                maxHeight: "calc(100vh - 70px)",
                            }}
                        >
                            <svg
                                id="creator-canvas"
                                // onClick={contextMenuFalse}
                                width={1000}
                                height={1000}
                      
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
                                        orient="auto"
                                    >
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#876" />
                                    </marker>
                                </defs>
                                {connections.map((link, index) => {
                                    return (
                                        <g key={index}>
                                            <line
                                                x1={link.source !== undefined ? link.source[0] : 0}
                                                y1={link.source !== undefined ? link.source[1] : 0}
                                                x2={link.target !== undefined ? link.target[0] : 0}
                                                y2={link.target !== undefined ? link.target[1] : 0}
                                                id={link.from + "_" + link.to}
                                                stroke="#999"
                                                strokeOpacity="0.6"
                                                strokeWidth="1.5"
                                                markerEnd="url(#triangle)"
                                            ></line>
                                        </g>
                                    );
                                })}
                                {nodes.map((node, index) => {
                                    return (
                                        <g key={index}>
                                            <rect
                                                x={(node.cx) - node.title.length * 2}
                                                y={(node.cy) - 5}
                                                width={node.title.length * 3 + 20}
                                                height={12}
                                                id={node.id}
                                                stroke="green"
                                                strokeWidth="2"
                                                strokeOpacity={0.5}
                                                rx="4" ry="4"
                                                fill={"#8FBC8F"}
                                            />
                                            <text
                                                x={(node.cx) - node.title.length * 2 + 8}
                                                y={(node.cy) + 5}
                                                id={node.id}
                                                fill={"black"}
                                                onClick={() => {}}
                                            >{node.title}</text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </TransformComponent>
                    </TransformWrapper>

                </div>
            </main>
        </div >
    )

};

export default Creator;
