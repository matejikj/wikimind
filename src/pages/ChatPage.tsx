import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { MdSend } from "react-icons/md";
import Sidenav from "../components/Sidenav";
import { SessionContext } from "../sessionContext";
import { ChatDataset } from "../models/types/ChatDataset";
import { Message } from "../models/types/Message";
import { MessageService } from "../service/messageService";
import { messageNotificationsSubscription } from "../service/notificationService";
import { generate_uuidv4 } from "../service/utils";

/**
 * Chat component for displaying and sending chat messages.
 */
const ChatPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [text, setText] = useState('');
    const sessionContext = useContext(SessionContext)
    const [messageDataset, setMessageDataset] = useState<ChatDataset | undefined>();

    const messageService = new MessageService()

    /**
     * Fetches the chat list for the given URL and updates the state with the fetched data.
     * Also, sets up a WebSocket for real-time chat updates.
     * 
     * @param {string} url - The URL to fetch the chat list from.
     * @returns {Promise<void>} - A Promise resolving to void.
     */
    async function fetchChatList(url: string): Promise<void> {
        try {
            const chat = await messageService.getChat(url);
            if (chat) {
                setMessageDataset(chat);
                const element = document.getElementById('id-' + (chat.messages.length - 1).toString());
                if (element) {
                    // 👇 Will scroll smoothly to the top of the next section
                    element.scrollIntoView({ behavior: 'auto' });
                }

                await messageNotificationsSubscription(chat.chat, setMessageDataset);
            }
        } catch (error) {
            alert(error)
        }
    }

    useEffect(() => {
        if (location.state !== null && location.state.id !== null) {
            fetchChatList(location.state.id);
        } else {
            navigate('/');
        }
    }, []);

    /**
     * Creates and sends a new chat message.
     */
    async function createMessage() {
        const message: Message = {
            id: generate_uuidv4(),
            from: sessionContext.sessionInfo.webId,
            text: text,
            date: Date.now()
        }
        if (messageDataset) {
            await messageService.sendMessage(messageDataset.chat, message);
            messageDataset.messages.push(message);
            setText('');
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
                                    variant="outline"
                                >
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

export default ChatPage;
