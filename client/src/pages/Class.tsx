import React, { useEffect, useState, useRef, useContext } from "react";
import { IProps } from "../models/types/types";
import Sidenav, { SideNavType } from "../components/Sidenav";
import Canvas from "../visualisation/Canvas";
import { Node } from "../models/types/Node";
import { ClassDataset } from "../models/types/ClassDataset";
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
import { DatasetLink } from "../models/types/DatasetLink";
import { getClassDataset } from "../service/classService";
import { Card, Col, Container, Row, Stack } from "react-bootstrap";
import './Class.css';

const Class: React.FC = () => {
  const d3Container = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const sessionContext = useContext(SessionContext)

  const ref = useRef(null);
  const [height, setHeight] = useState(1000);
  const [width, setWidth] = useState(1000);
  const [dataset, setDataset] = useState<ClassDataset>();

  const [mounted, setMounted] = useState(false); // <-- new state variable

  useEffect(() => {
    setMounted(true); // set the mounted state variable to true after the component mounts
  }, []);

  useEffect(
    () => {
      if (mounted) {
        if (location.state !== null && location.state.url !== null) {
          // const websocket4 = new WebsocketNotification(
          //   location.state.url,
          //   { fetch: fetch }
          // );
          // websocket4.on("message", (e: any) => {
          //   getClassDataset(location.state.url).then((res: any) => {
          //   })
          // });
          // websocket4.connect();
          console.log(location.state)
          if (sessionContext.sessionInfo.isLogged) {
            getClassDataset(sessionContext.sessionInfo, location.state.url).then((res: any) => {
              setDataset(res)
              console.log(dataset?.mindMaps.length)
            })
          }

        } else {
          navigate('/')
        }
      }
    }, [mounted])


  const showMindMap = (e: any) => {
    console.log(e.target.name)
    // navigate('/class/', {
    //   state: {
    //     url: e.target.name
    //   }
    // })
  }

  const removeMindMap = (e: any) => {
    console.log(e.target.name)
    // navigate('/class/', {
    //   state: {
    //     url: e.target.name
    //   }
    // })
  }

  const handleShow = (e: any) => {
    // if (sessionContext.sessionInfo.isLogged) {
    //   createNewClass(name, sessionContext.sessionInfo).then((res) => {
    //     console.log(res)
    //     // navigate('/class/', {
    //     //   state: {
    //     //     url: res
    //     //   }
    //     // })
    //   })
    // }
  }

  const copyToClipboard = (e: any) => {
    navigator.clipboard.writeText(sessionContext.sessionInfo.webId + "?classId=" + dataset?.id!)
  }

  return (
    <div className="App">
      <Sidenav type={SideNavType.COMMON} />
      <main ref={ref}>
        <Container fluid>
          <Row>
            <Col sm="6">
              <h1>Class {dataset?.name}</h1>
            </Col>
            <Col sm="6">
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <h6>Teacher: {dataset?.teacher}</h6>
            </Col>
            <Col sm="6">
              {
                (sessionContext.sessionInfo.webId === dataset?.teacher) &&
                <Stack direction="horizontal" gap={2}>
                <h6>Link for copy</h6>
                <Button onClick={copyToClipboard} variant="success">copy</Button>
              </Stack>
              }
            </Col>
          </Row>
          <Row>
            <Col sm="6">
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
            <Col sm="6">
              <Card className="class-card">
                <Container>
                  <Row>
                    <h4>Pupils</h4>
                    {dataset?.pupils.length === 0 &&
                      <p>No pupils already</p>
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
                </Container>
              </Card>

            </Col>
          </Row>
        </Container>
      </main>
    </div>
  )

};

export default Class;
