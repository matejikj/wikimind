import React, { useContext, useEffect, useRef, useState } from "react";
import Sidenav from "../components/Sidenav";
import { ClassDataset } from "../models/types/ClassDataset";
import Button from 'react-bootstrap/Button';
import { SessionContext } from "../sessionContext";
import { useLocation, useNavigate } from "react-router-dom";
import { fetch } from "@inrupt/solid-client-authn-browser";
import {
  WebsocketNotification,
} from "@inrupt/solid-client-notifications";
import { generate_uuidv4 } from "../service/utils";
import { getClass } from "../service/classService";
import { Card, Col, Container, Row, Stack } from "react-bootstrap";
import '../styles/style.css';
import { FcComments } from "react-icons/fc";
import { Exam } from "../models/types/Exam";
import { MindMap } from "../models/types/MindMap";
import ModalClassAddMindMap from "../components/ModalClassAddMindMap";
import { MdDeleteForever, MdDriveFileRenameOutline, MdSlideshow } from "react-icons/md";
import { CLASSES, MINDMAPS, SLASH, TTLFILETYPE, WIKIMIND, getPodUrl } from "../service/containerService";

const exampleExams: Exam[] = [{
  id: generate_uuidv4(),
  profile: 'inrupt.com/matejikj',
  mindMap: 'aaaaa',
  max: 5,
  result: 3
}]

const Class: React.FC = () => {
  const d3Container = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const sessionContext = useContext(SessionContext)

  const ref = useRef(null);
  const [height, setHeight] = useState(1000);
  const [width, setWidth] = useState(1000);
  const [url, setUrl] = useState('');
  const [modelClassAddShow, setModelClassAddShow] = useState(false);
  const [dataset, setDataset] = useState<ClassDataset>();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(
    () => {
      if (mounted) {
        if (location.state !== null && location.state.url !== null) {
          setUrl(location.state.url)
          // const websocket4 = new WebsocketNotification(
          //   location.state.url,
          //   { fetch: fetch }
          // );
          // websocket4.on("message", (e: any) => {
          //   getClassDataset(location.state.url).then((res: any) => {
          //     setDataset(res)
          //     console.log(dataset?.mindMaps.length)
          //   })
          // });
          // websocket4.connect();
          if (sessionContext.sessionInfo.isLogged) {
            getClass(location.state.url).then((res: any) => {
              setDataset(res)
              console.log(dataset?.mindMaps.length)
            })
          }
        } else {
          navigate('/')
        }
      }
    }, [mounted])

  async function showMindMap(item: MindMap) {
    const podUrls = await getPodUrl(dataset?.teacher!)
    console.log(podUrls)
    // if (podUrls !== null) {
    //   navigate('/visualisation/', {
    //     state: {
    //       id: name
    //     }
    //   })
  
    // }
  }

  const removeMindMap = (mindMap: MindMap) => {
    console.log(mindMap.id)
  }

  const handleCreate = (e: any) => {
    // #TODO - create in class new mindmap
  }

  const handleAddExisting = (e: any) => {
    setModelClassAddShow(true)
  }

  const sendMessage = (e: string) => {
    navigate('/messages/', {
      state: {
        friendId: e
      }
    })
  }

  const showExam = (mindMap: MindMap) => {
    const name = dataset?.storage + 'Wikie/mindMaps/' + mindMap.id + '.ttl';
    navigate('/exam/', {
      state: {
        id: name,
        class: location.state.url
      }
    })
  }

  const copyToClipboard = (e: any) => {
    navigator.clipboard.writeText(sessionContext.sessionInfo.webId + "?classId=" + dataset?.id!)
  }

  return (
    <div className="App">
      <Sidenav/>
      <main ref={ref}>
        <Container>
          <ModalClassAddMindMap showModal={modelClassAddShow} classUrl={sessionContext.sessionInfo.podUrl + WIKIMIND + SLASH + CLASSES + SLASH + dataset?.id + TTLFILETYPE} setModal={setModelClassAddShow}></ModalClassAddMindMap>
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
                        <div className='aaa'>
                          <div className='my-stack'>
                            {item.id}
                          </div>
                          <div className='my-stack-reverse'>
                            <Button
                              size='sm'
                              className='class-btn'
                              onClick={() => removeMindMap(item)}
                              variant="success"
                            >
                              <MdDeleteForever></MdDeleteForever>
                            </Button>
                            <Button
                              size='sm'
                              className='class-btn'
                              onClick={() => showExam(item)}
                              variant="success"
                            >
                              <MdDriveFileRenameOutline></MdDriveFileRenameOutline>
                            </Button>
                            <Button
                              size='sm'
                              className='class-btn'
                              onClick={() => showMindMap(item)}
                              variant="success"
                            >
                              <MdSlideshow></MdSlideshow>
                            </Button>
                          </div>
                        </div>
                      </Row>
                    )
                  })}
                  <Button onClick={handleCreate} variant="outline-success">Create new</Button>
                  <Button onClick={handleAddExisting} variant="outline-success">Add existing</Button>
                </Container>
              </Card>

            </Col>
            <Col sm="6">
              <Card className="class-card">
                <Container>
                  <Row>
                    <h4>Pupils</h4>
                    {dataset?.students.length === 0 &&
                      <p>No pupils already</p>
                    }
                  </Row>
                  {dataset?.students.map((item, index) => {
                    return (
                      <Row key={index}>
                        <div className='aaa'>
                          <div className='my-stack'>
                            {item.name} {item.surname}
                          </div>
                          <div className='my-stack-reverse'>
                            <Button
                              size='sm'
                              className="class-message"
                              variant="outline"
                              onClick={() => { sendMessage(item.webId) }}>
                              <FcComments>
                              </FcComments>
                            </Button>

                          </div>
                        </div>
                      </Row>
                    )
                  })}
                </Container>
              </Card>
            </Col>

            <Col sm="6">
              <Card className="class-card">
                <Container>
                  <Row>
                    <h4>Exams</h4>
                    {exampleExams.length === 0 &&
                      <p>No exams already</p>
                    }

                  </Row>
                  <table>
                    <tr>
                      <th>Pupil</th>
                      <th>MindMap</th>
                      <th>Max</th>
                      <th>Result</th>
                    </tr>
                    {exampleExams.map((item, index) => {
                      return (
                        <tr>
                          <td>{item.profile}</td>
                          <td>{item.mindMap}</td>
                          <td>{item.max}</td>
                          <td>{item.result}</td>
                        </tr>

                        // <Row key={index}>
                        //   <Col sm={9}>{item.name} {item.surname}</Col>
                        //   <Col sm={3}>

                        //     <Stack direction="horizontal" gap={2}>
                        //       <Button className="class-message" variant="outline" onClick={() => { sendMessage(item.webId) }}><FcComments> </FcComments></Button>

                        //     </Stack>
                        //   </Col>
                        // </Row>
                      )
                    })}
                  </table>

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