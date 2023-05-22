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
import { Card, Col, Container, ListGroup, Row, Stack } from "react-bootstrap";
import { getProfiles } from "../service/messageService";
import { FcComments } from "react-icons/fc";
import { Profile } from "../models/types/Profile";

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
    const [clickedUser, setClickedUser] = useState('')
    const sessionContext = useContext(SessionContext)


    useEffect(() => {
        const result = getProfiles(sessionContext.sessionInfo).then((res: any) => {
            setList(res)
            console.log(res)
        });

    }, []);

    React.useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth)
            // console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
        }
        window.addEventListener('resize', handleResize)
        setWidth(window.innerWidth)
    })

    const goPrivateMessage = (e: any) => {
        console.log(e)
        if (width > 770) {
            setClickedUser(e)
        } else {
            navigate('/chat/', {
                state: {
                    id: e
                }
            })
        }

    }


    return (
        <div className="App">
            <Sidenav type={SideNavType.COMMON} />
            <main ref={ref}>
                {width > 770 ? (
                    <Container fluid>
                        <Row>
                            <Col sm="6">
                                <Row>
                                    <h4>Classes mindMaps</h4>
                                    {list.length === 0 &&
                                        <p>No messages already</p>
                                    }

                                </Row>
                                <ListGroup>
                                    {list.map((item, index) => {
                                        return (
                                            <ListGroup.Item action onClick={() => { goPrivateMessage(item.webId) }} key={index}>
                                                <Col sm={9}>{item.name} {item.name}</Col>
                                            </ListGroup.Item>
                                        )
                                    })}
                                </ListGroup>

                            </Col>
                            <Col sm="6">
                                <Card className="class-card">
                                    <Container>
                                        <Row>
                                            <h4>Private msg</h4>
                                        </Row>
                                    </Container>
                                </Card>

                            </Col>
                        </Row>
                    </Container>
                ) : (
                    <Container fluid>
                        {/* <Row>
                            <Col sm="12">
                                <Card className="class-card">
                                    <Container>
                                        <Row>
                                            <h4>Classes mindMaps</h4>
                                            {dataset?.mindMaps.length === 0 &&
                                                <p>No mindMaps already</p>
                                            }

                                        </Row>
                                        {dataset?.mindMaps.map((item, index) => {
                                            return (
                                                <Row key={index}>
                                                    <Col sm={9}>{item.title}</Col>
                                                    <Col sm={3}>
                                                        <Stack direction="horizontal" gap={2}>
                                                            <div>
                                                                <Button
                                                                    className='class-btn'
                                                                    name={item.url}
                                                                    onClick={showMindMap}
                                                                    variant="success"
                                                                >Show</Button>
                                                                <br />
                                                            </div>
                                                            <div>
                                                                <Button
                                                                    className='class-btn'
                                                                    name={item.url}
                                                                    onClick={removeMindMap}
                                                                    variant="success"
                                                                >Remove</Button>
                                                                <br />
                                                            </div>

                                                        </Stack>
                                                    </Col>
                                                </Row>
                                            )
                                        })}
                                        <Button onClick={handleShow} variant="outline-success">Create new</Button>
                                    </Container>
                                </Card>

                            </Col>
                        </Row> */}
                    </Container>
                )}

            </main>
        </div>
    )

};

export default Visualisation;
