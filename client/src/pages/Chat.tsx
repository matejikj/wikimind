import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidenav from "../components/Sidenav";
import { SessionContext } from "../sessionContext";


import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { flushSync } from "react-dom";
import { MdSend } from "react-icons/md";
import { ChatDataset } from "../models/types/ChatDataset";
import { Message } from "../models/types/Message";
import { MessageService } from "../service/messageService";
import { wacChatWebSocket } from "../service/notificationService";
import { generate_uuidv4 } from "../service/utils";

const Chat: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [text, setText] = useState('');
    const sessionContext = useContext(SessionContext)
    const [messageDataset, setMessageDataset] = useState<ChatDataset | undefined>();
    const [mounted, setMounted] = useState(false); // <-- new state variable

    const messageService = new MessageService()

    async function fetchChatList(url: string): Promise<void> {
        try {
            const chat = await messageService.getChat(url);
            if (chat) {
                flushSync(() => {
                    setMessageDataset(chat)
                });
                const element = document.getElementById('id-' + (messageDataset!.messages.length - 1).toString());
                if (element) {
                    // 👇 Will scroll smoothly to the top of the next section
                    element.scrollIntoView({ behavior: 'auto' });
                }

                await wacChatWebSocket(chat.chat, setMessageDataset)
            }
        } catch (error) {
            // Handle the error, e.g., display an error message to the user or perform fallback actions
        }
    }

    useEffect(
        () => {
            if (location.state !== null && location.state.id !== null) {
                fetchChatList(location.state.id)
            } else {
                navigate('/')
            }
        }, [])

    async function createMessage() {
        const message: Message = {
            id: generate_uuidv4(),
            from: sessionContext.sessionInfo.webId,
            text: text,
            date: Date.now()
        }
        if (messageDataset) {
            await messageService.sendMessage(messageDataset.chat, message)
            messageDataset.messages.push(message)
            setText('')
        }
    }

    return (
        <div className="App">
            <Sidenav />
            <Container fluid className="h-100">
                <Row className="h-100">
                    <Col xs={12} className="p-0">
                        <div className="chat-container">
                            <div className="chat-messages">
                                {messageDataset && messageDataset.messages.sort((a, b) => a.date - b.date).map((message, index) => (
                                    <div
                                        key={'id-' + index.toString()}
                                        id={'id-' + index.toString()}
                                        className={`chat-message ${message.from === sessionContext.sessionInfo.webId ? 'mine' : 'other'}`}
                                    >
                                        {message.text}
                                    </div>
                                ))}
                            </div>
                            <Form className="chat-form">
                                <Form.Control
                                    type="text"
                                    onChange={(e) => { setText(e.target.value) }}
                                    value={text}
                                    placeholder="Type your message..."
                                />
                                <Button
                                    className='rounded-circle'
                                    onClick={() => createMessage()}

                                    variant="outline">
                                    <MdSend></MdSend>
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )

};

export default Chat;
