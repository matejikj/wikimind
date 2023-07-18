import React, { useContext, useEffect, useRef, useState } from "react";
import { Col, Container, Form, Modal, Row, Stack } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { FcComments } from "react-icons/fc";
import { MdDeleteForever, MdDriveFileRenameOutline, MdLink, MdSlideshow } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Sidenav from "../components/Sidenav";
import { ClassDataset } from "../models/types/ClassDataset";
import { Message } from "../models/types/Message";
import { MindMap } from "../models/types/MindMap";
import { ClassService } from "../service/classService";
import { CLASSES, MINDMAPS, TTLFILETYPE, WIKIMIND } from "../service/containerService";
import { generate_uuidv4 } from "../service/utils";
import { SessionContext } from "../sessionContext";
import '../styles/style.css';

const ClassPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionContext = useContext(SessionContext)

  const ref = useRef(null);
  const [announcementVisible, setAnnouncementVisible] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [dataset, setDataset] = useState<ClassDataset>();
  const [name, setName] = useState('');
  const [createNewModalVisible, setCreateNewModalVisible] = useState(false);

  const classService = new ClassService();

  async function fetchClass(url: string): Promise<void> {
    try {
      const classDataset = await classService.getClass(url);
      if (classDataset) {
        setDataset(classDataset)
      }
    } catch (error) {
    }
  }

  useEffect(
    () => {
      if (location.state !== null && location.state.url !== null) {
        fetchClass(location.state.url)
      } else {
        navigate('/')
      }
    }, [])

  async function showMindMap(mindMap: MindMap) {
    if (dataset) {
      const url = `${mindMap.source}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`
      if (dataset.class.teacher === sessionContext.sessionInfo.webId) {
        navigate('/editor/', {
          state: {
            id: url
          }
        })
      } else {
        navigate('/browser/', {
          state: {
            id: url
          }
        })
      }
    }
  }

  const removeMindMap = (mindMap: MindMap) => {
    console.log(mindMap.id)
  }

  async function addMindMap() {
    if (dataset) {
      const mindMapUrl = await classService.addMindMap(sessionContext.sessionInfo, dataset?.class, name)
      if (mindMapUrl) {
        navigate('/editor/', {
          state: {
            id: mindMapUrl
          }
        })
      }

    }
  }

  const sendMessage = (e: string) => {
    navigate('/chat/', {
      state: {
        id: e
      }
    })
  }

  async function showExam(mindMap: MindMap) {
    if (dataset) {
      const url = `${mindMap.source}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`
      const classUrl = `${dataset.class.source}${WIKIMIND}/${CLASSES}/${dataset.class.id}${TTLFILETYPE}`

      navigate('/exam/', {
        state: {
          id: url,
          class: classUrl
        }
      })

    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionContext.sessionInfo.webId + "?classId=" + dataset?.class.id)
  }

  async function createNewAnnoucement() {
    if (dataset) {
      const message: Message = {
        id: generate_uuidv4(),
        text: announcement,
        from: dataset.class.teacher,
        date: Date.now()
      };
      if (await classService.createNewAnnouncement(dataset.class, message)) {
        dataset.messages.push(message)
        setAnnouncement('')
      }
    }
  }

  async function removeAnnouncement(message: Message) {
    if (dataset) {
      if (await classService.removeAnnouncement(dataset.class, message)) {
        const a = dataset.messages.findIndex(item => item.id === message.id)
        dataset.messages.splice(a, 1)
        setAnnouncement('')
      }
    }
  }

  return (
    <div className="App">
      <Sidenav />
      <main ref={ref}>
        <Container>
          <Modal show={createNewModalVisible} onHide={() => setCreateNewModalVisible(false)}>
            <Modal.Header>
              <Modal.Title>Choose name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Control
                  type="text"
                  placeholder="insert name"
                  aria-label="insert name"
                  value={name}
                  onChange={(e) => { setName(e.target.value) }}
                />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className='my-btn'
                variant="secondary" onClick={() => setCreateNewModalVisible(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={addMindMap}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          <Row>
            <Col sm="6">
              <h1>Class {dataset?.class.name}</h1>
            </Col>
            <Col sm="6">
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <h6>Teacher: {dataset?.class.teacher}</h6>
            </Col>
            <Col sm="6">
              {
                (sessionContext.sessionInfo.webId === dataset?.class.teacher) &&
                <Stack direction="horizontal" gap={2}>
                  <span
                  >
                    Copy inviting link
                  </span>
                  <Button
                    onClick={() => copyToClipboard()}
                    size="sm"
                    variant="outline-dark"
                    className='rounded-circle'
                  >
                    <MdLink></MdLink>
                  </Button>
                </Stack>
              }
            </Col>
          </Row>

          <Row>
            <Col sm="12">
              <Container className="class-container">
                <Row>
                  <h4>Announcements</h4>
                  {dataset?.messages.length === 0 &&
                    <p>No announcements already</p>
                  }
                </Row>
                {dataset?.messages.map((item, index) => {
                  return (
                    <Row key={index}>
                      <div className='aaa'>
                        <div className='my-stack'>
                          {item.text}
                        </div>
                        <div className='my-stack-reverse'>
                          <Button
                            size="sm"
                            className='rounded-circle'
                            onClick={() => removeAnnouncement(item)}
                            variant="success"
                          >
                            <MdDeleteForever></MdDeleteForever>
                          </Button>
                        </div>
                      </div>
                    </Row>
                  )
                })}
                <Row>
                  {announcementVisible ?
                    <Stack direction="horizontal" gap={1}>
                      <Form.Control
                        type="text"
                        id="inputPassword5"
                        value={announcement}
                        name="id"
                        size='sm'
                        style={{ maxWidth: '600px' }}
                        onChange={(e) => { setAnnouncement(e.target.value) }}
                      />
                      <Button
                        onClick={() => createNewAnnoucement()}
                        variant="success"
                        size="sm"
                      >
                        Add
                      </Button>
                      <Button
                        onClick={() => { setAnnouncementVisible(false) }}
                        variant="danger"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </Stack> :
                    <Stack direction="horizontal" gap={1}>
                      {
                        dataset?.class.teacher === sessionContext.sessionInfo.webId &&
                        <Button size='sm' onClick={() => setAnnouncementVisible(true)} variant="primary">Create new announcement</Button>
                      }
                    </Stack>
                  }
                </Row>
              </Container>
            </Col>

            <Col sm="12">
              <Container className="class-container">
                <Row>
                  <h4>Mind maps</h4>
                  {dataset?.mindMaps.length === 0 &&
                    <p>No mind maps already</p>
                  }
                </Row>
                {dataset?.mindMaps.map((item, index) => {
                  return (
                    <Row key={index}>
                      <div className='aaa'>
                        <div className='my-stack'>
                          {item.name}
                        </div>
                        <div className='my-stack-reverse'>
                          {
                            dataset?.class.teacher === sessionContext.sessionInfo.webId &&
                            <Button
                              size="sm"
                              className='rounded-circle'
                              onClick={() => removeMindMap(item)}
                              variant="success"
                            >
                              <MdDeleteForever></MdDeleteForever>
                            </Button>
                          }
                          <Button
                            size="sm"
                            className='rounded-circle'
                            onClick={() => showExam(item)}
                            variant="success"
                          >
                            <MdDriveFileRenameOutline></MdDriveFileRenameOutline>
                          </Button>
                          <Button
                            size="sm"
                            className='rounded-circle'
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
                {
                  dataset?.class.teacher === sessionContext.sessionInfo.webId &&
                  <Button onClick={() => setCreateNewModalVisible(true)} variant="outline-success">Create new</Button>
                }
              </Container>
            </Col>
            <Col sm="12">
              <Container className="class-container">
                <Row>
                  <h4>Students</h4>
                  {dataset?.students.length === 0 &&
                    <p>No students already</p>
                  }
                </Row>
                {dataset?.students.map((item, index) => {
                  return (
                    <Row key={index}>
                      <div className='aaa'>
                        <div className='my-stack'>
                          {
                            (item.name === "" && item.surname === "") &&
                            <p>{item.webId}</p>
                          }
                          {
                            (item.name !== "" || item.surname !== "") &&
                            <p>{`${item.name} ${item.surname}`}</p>
                          }

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
            </Col>

            <Col sm="12">
              <Container className="class-container">
                <Row>
                  <h4>Exams</h4>
                  {/* {exampleExams.length === 0 &&
                    <p>No exams already</p>
                  } */}
                </Row>
                <table>
                  <tr>
                    <th>Pupil</th>
                    <th>MindMap</th>
                    <th>Max</th>
                    <th>Result</th>
                  </tr>
                  {/* {exampleExams.map((item, index) => {
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
                  })} */}
                </table>
              </Container>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  )
};

export default ClassPage;