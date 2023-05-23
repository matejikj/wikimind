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
import { Card, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { MdSend } from "react-icons/md";
import { Message } from "../models/types/Message";
import { flushSync } from "react-dom";

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

const PrivateChat: React.FC = () => {
    const d3Container = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const countRef = useRef(0);

    const ref = useRef(null);
    const [height, setHeight] = useState(1000);
    const [width, setWidth] = useState(500);
    const theme = useContext(SessionContext)
    const [mounted, setMounted] = useState(false); // <-- new state variable
    const [messages, setMessages] = useState<Message[]>([]);

    React.useEffect(() => {
        // if (location.state !== null && location.state.webID !== null) {

        // }
        flushSync(() => {
            setMessages(exx)
        });
        const element = document.getElementById('12321');
        if (element) {
            // 👇 Will scroll smoothly to the top of the next section
            element.scrollIntoView({ behavior: 'auto' });
        }
    })

    return (
        <div className="App">
            <Sidenav type={SideNavType.COMMON} />
            <main ref={ref}>
                <Card>
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
            </main>
        </div>
    )

};

export default PrivateChat;
