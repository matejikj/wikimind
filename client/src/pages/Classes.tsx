import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { SessionContext } from '../sessionContext';
import { ClassService, denyRequest } from '../service/classService';
import { Class } from '../models/types/Class';
import { Card, Col, Container, Row, Stack } from 'react-bootstrap';
import { Request } from '../models/types/Request';
import { MdDeleteForever, MdDriveFileRenameOutline, MdSlideshow } from 'react-icons/md';
import { RxCheck, RxCross2 } from 'react-icons/rx';

import '../styles/style.css';
import { CLASSES, SLASH, TTLFILETYPE, WIKIMIND } from '../service/containerService';

const authOptions = {
  clientName: "Learnee",
};

const Classes: React.FC = () => {
  const [classList, setClassList] = useState<Class[]>([]);
  const [requestsCount, setRequestsCount] = useState(0);
  const [show, setShow] = useState(false);
  const [request, setRequest] = useState(false);
  const [requestUrl, setRequestUrl] = useState("");
  const [name, setName] = useState("");
  const [waiting, setWaiting] = useState(false);
  const sessionContext = useContext(SessionContext)
  const [requests, setRequests] = useState<Request[]>([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();
  const wssUrl = new URL(sessionContext.sessionInfo.podUrl);
  wssUrl.protocol = 'wss';

  const classesService = new ClassService();

  async function fetchData(): Promise<void> {
    try {
      const requests = await classesService.getRequests(sessionContext.sessionInfo);
      requests && setRequests(requests)
      const classes = await classesService.getClassList(sessionContext.sessionInfo.podUrl);
      classes && setClassList(classes)

    } catch (error) {
      // Handle the error, e.g., display an error message to the user or perform fallback actions
    }
  }

  useEffect(() => {
    fetchData();
    console.log(sessionContext.sessionInfo.webId)
  }, []);

  const showClass = (e: Class) => {
    const classUrl = e.ownerPod + WIKIMIND + SLASH + CLASSES + SLASH + e.id + TTLFILETYPE
    navigate('/class/', {
      state: {
        url: classUrl
      }
    })
  }

  async function deleteClass(classThing: Class) {
    if (classThing) {
      const removePromise = await classesService.removeClass(sessionContext.sessionInfo, classThing)
      if (removePromise) {
        setClassList((classList) =>
          classList.filter((item) => item.id !== classThing.id)
        )
        // setShowMindMapDeleteModal(false)
      }
    }
    await classesService.removeClass(sessionContext.sessionInfo, classThing)

  }

  async function allowRequest(request: Request) {
    if (request !== undefined) {
      setWaiting(true)
      await classesService.allowClassAccess(request, sessionContext.sessionInfo)
      setWaiting(false)
      setRequests((requests) =>
        requests.filter((item) => item.id !== request.id)
      )
    }

  }

  const denyAccess = (e: any) => {
    console.log(e.target.name)
    const aa = requests.find((item) => { return item.requestor === e.target.name })
    if (aa !== undefined) {
      denyRequest(sessionContext.sessionInfo, aa)
    }
  }

  async function sendRequest() {
    await classesService.requestClass(sessionContext.sessionInfo, requestUrl)
    setRequestUrl('')
    setRequest(false)

  }

  async function createNew(e: any) {
    const classUrl = await classesService.createNewClass(name, sessionContext.sessionInfo);
    if (classUrl) {
      navigate('/class/', {
        state: {
          url: classUrl
        }
      })
    }
  }

  return (
    <div className="App">
      <Sidenav />
      <main>
        <Modal show={show} onHide={handleClose}>
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
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={createNew}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Container>
          <Row>
            <h1>Your classes!</h1>
          </Row>

          {classList && classList.map((item, index) => {
            return (
              <Row key={index}>
                <div className='aaa'>
                  <div className='my-stack'>
                    {item.name}
                  </div>
                  <div className='my-stack-reverse'>
                    {item.teacher === sessionContext.sessionInfo.webId &&
                      <Button
                        size="sm"
                        className='rounded-circle'
                        onClick={() => deleteClass(item)}
                        variant="outline-danger"
                      >
                        <MdDeleteForever></MdDeleteForever>
                      </Button>

                    }

                    <Button
                      size="sm"
                      className='rounded-circle'
                      onClick={() => showClass(item)}
                      variant="outline-success"
                    >
                      <MdSlideshow></MdSlideshow>
                    </Button>

                  </div>

                </div>
              </Row>
            )
          })}
          <Row>

            {request ?
              <Stack direction="horizontal" gap={1}>
                <Form.Control
                  type="text"
                  id="inputPassword5"
                  value={requestUrl}
                  name="id"
                  size='sm'
                  style={{ maxWidth: '600px' }}
                  onChange={(e) => { setRequestUrl(e.target.value) }}
                />
                <Button
                  onClick={sendRequest}
                  variant="success"
                  size="sm"
                >
                  Request
                </Button>
                <Button
                  onClick={() => { setRequest(false) }}
                  variant="danger"
                  size="sm"
                >
                  Cancel
                </Button>
              </Stack> :
              <Stack direction="horizontal" gap={1}>
                <Button size='sm' onClick={handleShow} variant="primary">Create new class</Button>
                <Button size='sm' onClick={() => { setRequest(true) }} variant="success">Add class</Button>
              </Stack>
            }
          </Row>
          <Row>
            <Col sm="12">
              <Container className='class-container'>
                <Row>
                  <h4>Requests</h4>
                  {requests.length === 0 &&
                    <p>No requests already</p>
                  }

                </Row>

                {requests.map((item, index) => {
                  return (
                    <Row key={index}>
                      <div className='aaa'>
                        <div className='my-stack'>
                          {item.requestor}
                        </div>
                        <div className='my-stack-reverse'>
                          
                          <Button
                            size="sm"
                            className='rounded-circle'
                            name={item.requestor}
                            onClick={() => allowRequest(item)}
                            variant="success"
                          >
                            <RxCheck></RxCheck>
                          </Button>
                          <Button
                            size="sm"
                            className='rounded-circle'
                            name={item.requestor}
                            onClick={denyAccess}
                            variant="outline-danger"
                          >
                            <RxCross2></RxCross2>
                          </Button>
                        </div>
                      </div>
                    </Row>
                  )
                })}
              </Container>
            </Col>
          </Row>
        </Container>
      </main>
    </div>

  );
};

export default Classes;
