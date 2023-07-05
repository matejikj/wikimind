import React, { useContext, useRef, useState } from "react";
import Sidenav from "../components/Sidenav";
import { SessionContext } from "../sessionContext";
import { useLocation, useNavigate } from "react-router-dom";


import { Card, Form, Stack } from "react-bootstrap";
import { MdSend } from "react-icons/md";
import { Message } from "../models/types/Message";

const Chat: React.FC = () => {
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
        if (location.state !== null && location.state.webID !== null) {

        }
        // flushSync(() => {
        //     setMessages([])
        // });
        const element = document.getElementById('12321');
        if (element) {
            // 👇 Will scroll smoothly to the top of the next section
            element.scrollIntoView({ behavior: 'auto' });
        }
    })

    return (
        <div className="App">
            <Sidenav/>
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

export default Chat;
