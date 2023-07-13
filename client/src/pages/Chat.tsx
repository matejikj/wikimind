import React, { useContext, useEffect, useRef, useState } from "react";
import Sidenav from "../components/Sidenav";
import { SessionContext } from "../sessionContext";
import { useLocation, useNavigate } from "react-router-dom";


import { Button, Card, Col, Container, Form, Navbar, Row, Stack } from "react-bootstrap";
import { MdSend } from "react-icons/md";
import { Message } from "../models/types/Message";
import { flushSync } from "react-dom";
import { ChatDataset } from "../models/types/ChatDataset";
import { generate_uuidv4 } from "../service/utils";
import { WebsocketNotification } from "@inrupt/solid-client-notifications";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";
import { assignWebSocketACP } from "../service/notificationService";
import { MessageService } from "../service/messageService";

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
        const chats = await messageService.getChat(url);
        chats && setMessageDataset(chats)
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
      }, [mounted])

    // useEffect(() => {
    //     setMounted(true); // set the mounted state variable to true after the component mounts
    // }, []);

    // useEffect(
    //     () => {

    //         if (mounted) {
    //             if (location.state !== null && location.state.id !== null) {
    //                 messageService.getChat(location.state.id).then((res: ChatDataset | undefined) => {
    //                     if (res) {
    //                         setMessageDataset(res)
    //                         // if (sessionContext.sessionInfo.podAccessControlPolicy === AccessControlPolicy.ACP) {
    //                         //     assignWebSocketACP(location.state.id, setMessageDataset)
    //                         // } else {
    //                         const wssUrl = new URL(res.chat.ownerPod);
    //                         wssUrl.protocol = 'wss';


    //                         const socket = new WebSocket(wssUrl, ['solid-0.1']);
    //                         socket.onopen = function () {
    //                             this.send(`sub ${res.chat.storage}`)
    //                         };
    //                         socket.onmessage = function (msg) {
    //                             if (msg.data && msg.data.slice(0, 3) === 'pub') {
    //                                 if (msg.data === `pub ${res.chat.storage}`) {
    //                                     messageService.getChat(location.state.id).then((result: ChatDataset | undefined) => {
    //                                         if (result) {
    //                                             setMessageDataset(result)
    //                                         }
    //                                     })
    //                                 }
    //                             }
    //                         };
    //                         // }

    //                     }
    //                 })


    //             } else {
    //                 navigate('/')
    //             }

    //         }
    //     }, [mounted])

    // useEffect(() => {
    //     if (location.state !== null && location.state.id !== null) {

    //     } else {
    //         navigate('/')
    //     }
    //     // flushSync(() => {
    //     //     setMessages([])
    //     // });
    //     const element = document.getElementById('12321');
    //     if (element) {
    //         // 👇 Will scroll smoothly to the top of the next section
    //         element.scrollIntoView({ behavior: 'auto' });
    //     }
    // })

    const createMessage = () => {
        const message: Message = {
            id: generate_uuidv4(),
            from: sessionContext.sessionInfo.webId,
            text: text,
            date: Date.now()
        }
        if (messageDataset) {
            messageService.sendMessage(messageDataset.chat, message).then(() => {
                setText('')
            })
        }
        // const url = `${sessionContext.sessionInfo.podUrl}${WIKIMIND}/${MESSAGES}/${e.id}${TTLFILETYPE}`
        // navigate('/chat/', {
        //   state: {
        //     id: url
        //   }
        // })
    }

    return (
        <div className="App">
            <Sidenav />
            <Container fluid className="h-100">
                <Row className="h-100">
                    <Col xs={12} className="p-0">
                        <div className="chat-container">
                            <div className="chat-messages">
                                {messageDataset && messageDataset.messages.map((message, index) => (
                                    <div
                                        key={index}
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
