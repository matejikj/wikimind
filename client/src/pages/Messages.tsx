import React, { useContext, useEffect, useRef, useState } from "react";
import Sidenav from "../components/Sidenav";
import { SessionContext } from "../sessionContext";
import { useLocation, useNavigate } from "react-router-dom";


import { Card, Col, Container, Form, ListGroup, Row, Stack } from "react-bootstrap";
import { getFriendMessages, getProfiles } from "../service/messageService";
import { Profile } from "../models/types/Profile";
import { Message } from "../models/types/Message";
import { MdSend } from "react-icons/md";
import '../styles/style.css';

const divWidth = 770

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
        const result = getProfiles(sessionContext.sessionInfo).then((res: any) => {
            setList(res)
            console.log(res)
        });
        
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
    }, []);

    // React.useEffect(() => {


    // })

    const goPrivateMessage = (e: any) => {
        if (width > divWidth) {
            setClickedUser(e)
            // flushSync(() => {
            //     setMessages(exx)
            //     // getFriendMessages(theme.sessionInfo, e)
            // });

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
            <Sidenav/>
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
                                            <Col sm={9}>{item.name} {item.surname}</Col>
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
