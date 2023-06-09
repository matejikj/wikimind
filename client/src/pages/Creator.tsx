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
import { Card, Col, Container, Form, ListGroup, Pagination, Row, Stack } from "react-bootstrap";
import { getFriendMessages, getProfiles } from "../service/messageService";
import { Profile } from "../models/types/Profile";
import { Message } from "../models/types/Message";
import { MdSend } from "react-icons/md";
import './Messages.css';
import { flushSync } from "react-dom";
import axios from "axios";
import { getCategoryInfo } from "../service/dbpediaService";

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
    const [results, setResults] = useState<{ title: string; comment: any; }[]>([]);
    const [recommends, setRecommends] = useState<any[]>([]);

    let active = 4;
    let items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
                {number}{number}
            </Pagination.Item>,
        );
    }

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

    const getEntity = (e: any) => {
        console.log()
    }
    const language = 'en';

    async function searchKeyword(event: any) {
        const url = "https://lookup.dbpedia.org/api/search?label=" + formInputs
        axios.get("https://lookup.dbpedia.org/api/search", {
            params: {
                format: 'json',
                label: formInputs,
                languages: language
            },
            headers: {
                Accept: 'application/json'
            }
        })
            .then(response => {
                // Handle the response data
                let a = response.data.docs.slice(0, 30)
                a = a.map((item: any) => {
                    return {
                        title: item.label === undefined ? '' : item.label[0].replace('<B>', '').replace('</B>', ''),
                        comment: item.comment === undefined ? '' : item.resource[0]
                    }
                })
                setResults(a)
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });
    }

    async function getRecs(event: any) {
        const a = await getCategoryInfo(event)
        if (a) {
            setRecommends(a)

        }

    }

    return (
        <div className="App">
            <Sidenav type={SideNavType.COMMON} />
            <main ref={ref}>
                {width > divWidth ? (
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
                                    value={currentProvider}
                                    aria-label="Default select example"
                                    style={{ maxWidth: '600px' }}
                                >
                                    {results.map((item, index) => {
                                        return (
                                            <option value={item.comment}>{item.title}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Stack>
                        </Row>
                        <Row>
                            <Pagination>{items}</Pagination>
                        </Row>
                        <Row>
                            <Col sm="4">
                                <Card>
                                    <Card.Body>
                                        <Stack className="message-box">
                                            {recommends.map((item, index) => {
                                                return (
                                                    <Card className="message-bubble">
                                                        <Stack direction="horizontal" gap={2}>
                                                                    <p>item</p>
                                                                    <Button>+</Button>
                                                                    <Button>I</Button>
                                                        </Stack>
                                                    </Card>
                                                )
                                            })}
                                        </Stack>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm="4">
                                fds
                            </Col>
                            <Col sm="4">
                                gr
                            </Col>
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
