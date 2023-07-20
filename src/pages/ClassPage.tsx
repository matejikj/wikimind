import React, { useContext, useEffect, useRef, useState } from "react";
import { Col, Container, Form, Modal, Row, Stack } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { BsTrashFill } from "react-icons/bs";
import { MdDeleteForever, MdDriveFileRenameOutline, MdLink, MdRefresh, MdSlideshow } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Sidenav from "../components/Sidenav";
import { ClassDataset } from "../models/types/ClassDataset";
import { Exam } from "../models/types/Exam";
import { Message } from "../models/types/Message";
import { MindMap } from "../models/types/MindMap";
import { Profile } from "../models/types/Profile";
import { getNumberFromUrl } from "../repository/utils";
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

  /**
 * Fetches the class dataset using the provided URL from the location state.
 * The fetched class dataset is stored in the component state variable 'dataset'.
 */
  async function fetchClass(): Promise<void> {
    try {
      const classDataset = await classService.getClass(location.state.url);
      if (classDataset) {
        setDataset(classDataset);
      }
    } catch (error) {
      alert(error)
    }
  }

  /**
   * Fetches the class dataset when the component mounts.
   * If the location state is null or the URL is not provided, it navigates back to the homepage.
   */
  useEffect(() => {
    if (location.state !== null && location.state.url !== null) {
      fetchClass();
    } else {
      navigate('/');
    }
  }, []);

  /**
   * Shows the mind map in the editor or browser based on the user's role (teacher or student).
   * @param mindMap - The MindMap object to be shown.
   */
  async function showMindMap(mindMap: MindMap) {
    if (dataset) {
      const url = `${mindMap.source}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`;
      if (dataset.class.teacher === sessionContext.sessionInfo.webId) {
        navigate('/editor/', {
          state: {
            id: url
          }
        });
      } else {
        navigate('/browser/', {
          state: {
            id: url
          }
        });
      }
    }
  }

  /**
   * Adds a new mind map to the class using the provided name.
   * The newly created mind map URL is used to navigate to the editor page for editing the mind map.
   */
  async function addMindMap() {
    if (dataset) {
      const mindMapUrl = await classService.addMindMap(sessionContext.sessionInfo, dataset?.class, name);
      if (mindMapUrl) {
        navigate('/editor/', {
          state: {
            id: mindMapUrl
          }
        });
      }
    }
  }

  /**
   * Shows the exam details for the selected mind map.
   * @param mindMap - The MindMap object for which the exam details are to be shown.
   */
  async function showExam(mindMap: MindMap) {
    if (dataset) {
      const url = `${mindMap.source}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`;
      const classUrl = `${dataset.class.source}${WIKIMIND}/${CLASSES}/${dataset.class.id}${TTLFILETYPE}`;

      navigate('/exam/', {
        state: {
          id: url,
          classStorage: dataset.class.storage,
          classUrl: classUrl
        }
      });
    }
  }

  /**
   * Copies the class URL with the classId to the clipboard.
   * The URL is in the format: sessionContext.sessionInfo.webId + "?classId=" + dataset?.class.id
   */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionContext.sessionInfo.webId + "?classId=" + dataset?.class.id);
  }

  /**
   * Creates a new announcement and adds it to the class dataset.
   * The announcement is created with the teacher's webId, current date, and the entered announcement text.
   */
  async function createNewAnnouncement() {
    if (dataset) {
      const message: Message = {
        id: generate_uuidv4(),
        text: announcement,
        from: dataset.class.teacher,
        date: Date.now()
      };
      if (await classService.createNewAnnouncement(dataset.class, message)) {
        dataset.messages.push(message);
        setAnnouncement('');
      }
    }
  }

  /**
   * Removes an announcement from the class dataset.
   * @param message - The Message object to be removed.
   */
  async function removeAnnouncement(message: Message) {
    if (dataset) {
      if (await classService.removeAnnouncement(dataset.class, message)) {
        const filteredMessages = dataset.messages.filter((item) => item.id !== message.id);
        setDataset({
          ...dataset,
          messages: filteredMessages
        });
        setAnnouncement('');
      }
    }
  }

  /**
   * Removes a student from the class dataset.
   * @param student - The Profile object of the student to be removed.
   * Note: The function implementation is missing, and the comment is left as a placeholder.
   */
  async function removeStudent(student: Profile) {
    if (dataset) {
      // Implement this function as per your requirements
    }
  }

  /**
   * Removes an exam from the class dataset.
   * @param exam - The Exam object to be removed.
   */
  async function removeExam(exam: Exam) {
    if (dataset) {
      if (await classService.removeExam(exam, dataset.class)) {
        const filteredExams = dataset.testResults.filter((item) => item.id !== exam.id);
        setDataset({
          ...dataset,
          testResults: filteredExams
        });
        setAnnouncement('');
      }
    }
  }

  /**
   * Removes a mind map from the class dataset.
   * @param mindMap - The MindMap object to be removed.
   */
  async function removeMindMap(mindMap: MindMap) {
    if (dataset) {
      if (await classService.removeClassMindMap(mindMap, dataset.class)) {
        const filteredMindMaps = dataset.mindMaps.filter((item) => item.id !== mindMap.id);
        setDataset({
          ...dataset,
          mindMaps: filteredMindMaps
        });
        setAnnouncement('');
      }
    }
  }

  /**
   * Gets the profile detail (name and surname) for a given webID.
   * If the name and surname are not available, it returns the webID as the profile detail.
   * @param webID - The webID of the profile.
   * @returns The profile detail (name and surname) or the webID.
   */
  function getProfileDetail(webID: string) {
    const profile = dataset?.students.find((item) => item.webId === webID);
    if (profile && (profile.name !== "" || profile.surname !== "")) {
      return `${profile.name} ${profile.surname}`;
    }
    return webID;
  }

  /**
   * Gets the name of a mind map from its ID using the dataset.
   * @param id - The ID of the mind map.
   * @returns The name of the mind map corresponding to the given ID or undefined if not found.
   */
  function getMindMapName(id: string) {
    const mindMap = dataset?.mindMaps.find((item) => item.id === getNumberFromUrl(id));
    if (mindMap) {
      return mindMap.name;
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
              <Stack>
                <h6>Teacher: {dataset?.class.teacher}</h6>
                <div>
                  <Button
                    className="rounded-circle"
                    size="sm"
                    onClick={() => fetchClass()}
                  >
                    <MdRefresh>
                    </MdRefresh>
                  </Button>
                </div>

              </Stack>
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
                      <div className='stack-row'>
                        <div className='my-stack'>
                          {item.text}
                        </div>
                        <div className='my-stack-reverse'>
                          {(sessionContext.sessionInfo.webId === dataset?.class.teacher) &&

                            <Button
                              size="sm"
                              className='rounded-circle'
                              onClick={() => removeAnnouncement(item)}
                              variant="success"
                            >
                              <MdDeleteForever></MdDeleteForever>
                            </Button>}
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
                        onClick={() => createNewAnnouncement()}
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
                      <div className='stack-row'>
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
                              variant="outline-danger"
                            >
                              <MdDeleteForever></MdDeleteForever>
                            </Button>
                          }
                          {
                            dataset?.class.teacher !== sessionContext.sessionInfo.webId &&
                            <Button
                              size="sm"
                              className='rounded-circle'
                              onClick={() => showExam(item)}
                              variant="outline-success"
                            >
                              <MdDriveFileRenameOutline></MdDriveFileRenameOutline>
                            </Button>
                          }
                          <Button
                            size="sm"
                            className='rounded-circle'
                            onClick={() => showMindMap(item)}
                            variant="outline-success"
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
                      <div className='stack-row'>
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
                        {
                          dataset?.class.teacher === sessionContext.sessionInfo.webId &&
                          <div className='my-stack-reverse'>
                            <Button
                              size='sm'
                              className='rounded-circle'
                              variant="outline-danger"
                              onClick={() => { removeStudent(item) }}>
                              <BsTrashFill>
                              </BsTrashFill>
                            </Button>
                          </div>
                        }
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
                  {dataset && dataset.testResults.length === 0 &&
                    <p>No exams already</p>
                  }
                </Row>
                <Row>
                  {dataset && dataset.testResults.length > 0 &&
                    <table>
                      <tr>
                        <th>Pupil</th>
                        <th>MindMap</th>
                        <th>Max</th>
                        <th>Result</th>
                        <th></th>
                      </tr>
                      {dataset?.testResults.map((item, index) => {
                        return (
                          <tr>
                            <td>{getProfileDetail(item.profile)}</td>
                            <td>{getMindMapName(item.mindMap)}</td>
                            <td>{item.max}</td>
                            <td>{item.result}</td>
                            <td>
                              {
                                dataset?.class.teacher === sessionContext.sessionInfo.webId &&
                                <Button
                                  size='sm'
                                  className='rounded-circle'
                                  variant="outline-danger"
                                  onClick={() => { removeExam(item) }}>
                                  <BsTrashFill>
                                  </BsTrashFill>
                                </Button>

                              }
                            </td>
                          </tr>
                        )
                      })}
                    </table>}

                </Row>

              </Container>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  )
};

export default ClassPage;