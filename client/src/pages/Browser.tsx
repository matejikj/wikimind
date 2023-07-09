import React, { useContext, useEffect, useRef, useState } from "react";
import Sidenav from "../components/Sidenav";
import { SessionContext } from "../sessionContext";
import { useLocation, useNavigate } from "react-router-dom";


import { Button, Card, Col, Container, Form, Navbar, Row, Stack } from "react-bootstrap";
import { MdSend } from "react-icons/md";
import { Message } from "../models/types/Message";
import { flushSync } from "react-dom";
import { ChatDataset } from "../models/types/ChatDataset";
import { getChat, sendMessage } from "../service/messageService";
import { generate_uuidv4 } from "../service/utils";
import { WebsocketNotification } from "@inrupt/solid-client-notifications";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";
import { assignWebSocketACP } from "../service/notificationService";

const Browser: React.FC = () => {
    const d3Container = useRef(null);
    const navigate = useNavigate();
    const countRef = useRef(0);

    const ref = useRef(null);
    const [height, setHeight] = useState(1000);
    const [width, setWidth] = useState(500);
    const [text, setText] = useState('');
    const sessionContext = useContext(SessionContext)
    const [messageDataset, setMessageDataset] = useState<ChatDataset | undefined>();
    const [mounted, setMounted] = useState(false); // <-- new state variable
    const location = useLocation()
  

    return (
        <div className="App">
            <Sidenav />
            <Container fluid className="h-100">
                <h1>{location.pathname}</h1>
            </Container>
        </div>
    )

};

export default Browser;
