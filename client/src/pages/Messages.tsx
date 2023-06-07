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
import { Card, Col, Container, Form, ListGroup, Row, Stack } from "react-bootstrap";
import { getFriendMessages, getProfiles } from "../service/messageService";
import { Profile } from "../models/types/Profile";
import { Message } from "../models/types/Message";
import { MdSend } from "react-icons/md";
import './Messages.css';
import { flushSync } from "react-dom";

const divWidth = 770
const exx: Message[] = [
    {
        id: "1",
        from: "jakub",
        to: "matej",
        text: "faewaew",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "3",
        from: "jakub",
        to: "matej",
        text: "zdarec",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "4",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "5",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "6",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "7",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "8",
        from: "jakub",
        to: "matej",
        text: "zdarec",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "9",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "10",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "11",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "1",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "3",
        from: "jakub",
        to: "matej",
        text: "zdarec",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "4",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "5",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "6",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "7",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "8",
        from: "jakub",
        to: "matej",
        text: "zdarec",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "9",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "10",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "11",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    }, {
        id: "1",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "3",
        from: "jakub",
        to: "matej",
        text: "zdarec",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "4",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "5",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "6",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "7",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "8",
        from: "jakub",
        to: "matej",
        text: "zdarec",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "9",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "10",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "11",
        from: "matej",
        to: "jakub",
        text: "last",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "1",
        from: "jakub",
        to: "matej",
        text: "faewaew",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "3",
        from: "jakub",
        to: "matej",
        text: "zdarec",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "4",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "5",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "6",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "7",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "8",
        from: "jakub",
        to: "matej",
        text: "zdarec",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "9",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "10",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "11",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "1",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "3",
        from: "jakub",
        to: "matej",
        text: "zdarec",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "4",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "5",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "6",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "7",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "8",
        from: "jakub",
        to: "matej",
        text: "zdarec",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "9",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "10",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "11",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    }, {
        id: "1",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "3",
        from: "jakub",
        to: "matej",
        text: "zdarec",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "4",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "5",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "6",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "7",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "8",
        from: "jakub",
        to: "matej",
        text: "zdarec",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "9",
        from: "matej",
        to: "jakub",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "10",
        from: "jakub",
        to: "matej",
        text: "Hello world",
        date: "1.1.2023 10:50:20"
    },
    {
        id: "12321",
        from: "matej",
        to: "jakub",
        text: "last",
        date: "1.1.2023 10:50:20"
    },

]

const Visualisation: React.FC = () => {
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



    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth)
            // console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
        }
        window.addEventListener('resize', handleResize)
        setWidth(window.innerWidth)
        if (location.state !== null && location.state.friendId !== null) {
            if (width < divWidth) {
                navigate('/chat/', {
                    state: {
                        friendId: location.state.friendId
                    }
                })
            } else {
                setClickedUser(location.state.friendId)
                getFriendMessages(theme.sessionInfo ,location.state.friendId)
            }
        }

        const result = getProfiles(sessionContext.sessionInfo).then((res: any) => {
            setList(res)
            console.log(res)
        });
    }, []);

    React.useEffect(() => {


    })

    const goPrivateMessage = (e: any) => {
        if (width > divWidth) {
            setClickedUser(e)
            flushSync(() => {
                setMessages(exx)
                // getFriendMessages(theme.sessionInfo, e)
            });

            const element = document.getElementById('12321');
            if (element) {
                // 👇 Will scroll smoothly to the top of the next section
                element.scrollIntoView({ behavior: 'auto' });
            }
        } else {
            navigate('/chat/', {
                state: {
                    id: e
                }
            })
        }

        // 12321

    }


    return (
        <div className="App">
            <Sidenav type={SideNavType.COMMON} />
            <main ref={ref}>
                <Container>
                    <Row>
                        <Col sm="6">

                            <Row className="message-card">
                                {list.length === 0 &&
                                    <p>No contacts already</p>
                                }
                            </Row>
                            <ListGroup>
                                {list.map((item, index) => {
                                    return (
                                        <ListGroup.Item action onClick={() => { goPrivateMessage(item.webId) }} key={index}>
                                            <Col sm={9}>{item.webId}</Col>
                                        </ListGroup.Item>
                                    )
                                })}
                            </ListGroup>
                        </Col>
                        {width > divWidth && (
                            <Col sm="6">
                                {clickedUser !== '' ?
                                    <Card className="message-card">
                                        <Card.Header>
                                           {clickedUser} 
                                        </Card.Header>
                                        <Card.Body>
                                            <Stack className="message-box">
                                                {messages.map((item, index) => {
                                                    return (
                                                        <Card className="message-bubble">
                                                            <Card.Body id={item.id}>
                                                                {item.text}
                                                            </Card.Body>
                                                        </Card>
                                                    )
                                                })}
                                            </Stack>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Stack direction="horizontal" gap={2}>
                                                <Form.Control
                                                    type="text"
                                                    id="inputPassword5"
                                                    aria-describedby="passwordHelpBlock"
                                                />
                                                <MdSend></MdSend>
                                            </Stack>
                                        </Card.Footer>
                                    </Card>
                                    :
                                    <Card className="message-card">
                                        <Card.Body>
                                            <p>First select contact</p>
                                        </Card.Body>
                                    </Card>}
                            </Col>
                        )}
                    </Row>
                </Container>
            </main>
        </div>
    )

};

export default Visualisation;
