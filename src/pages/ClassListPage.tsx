import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import Sidenav from "../components/Sidenav";

import { Col, Container, Row, Spinner, Stack } from 'react-bootstrap';
import { MdDeleteForever, MdRefresh, MdSlideshow } from 'react-icons/md';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import { Class } from '../models/types/Class';
import { Request } from '../models/types/Request';
import { ClassService } from '../service/classService';
import { SessionContext } from '../sessionContext';

import { CLASSES, SLASH, TTLFILETYPE, WIKIMIND } from '../service/containerService';
import '../styles/style.css';

const ClassListPage: React.FC = () => {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext)

  const [classList, setClassList] = useState<Class[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);

  const [show, setShow] = useState(false);
  const [request, setRequest] = useState(false);
  const [requestUrl, setRequestUrl] = useState("");
  const [name, setName] = useState("");

  const [waiting, setWaiting] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const classesService = new ClassService();

  async function fetchData(): Promise<void> {
    try {
      const requests = await classesService.getRequests(sessionContext.sessionInfo);
      requests && setRequests(requests)
      const classes = await classesService.getClassList(sessionContext.sessionInfo.podUrl);
      classes && setClassList(classes)
    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const showClass = (e: Class) => {
    const classUrl = e.source + WIKIMIND + SLASH + CLASSES + SLASH + e.id + TTLFILETYPE
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

  async function denyAccess(request: Request) {
    try {
      await classesService.denyClassRequest(request, sessionContext.sessionInfo)
      setRequests((requests) =>
        requests.filter((item) => item.id !== request.id)
      )
    } catch (error) {
      alert(error)
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
                <div className='stack-row'>
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
                <Stack gap={1}>
                  <h4>Requests</h4>
                  <div>
                    <Button
                      className="rounded-circle"
                      size="sm"
                      onClick={() => fetchData()}
                    >
                      <MdRefresh>
                      </MdRefresh>
                    </Button>
                  </div>
                  {requests.length === 0 &&
                    <p>No requests</p>
                  }
                </Stack>
                {requests.map((item, index) => {
                  return (
                    <Row key={index}>
                      <div className='stack-row'>
                        <div className='my-stack'>
                          {item.requestor}
                        </div>
                        <div className='my-stack-reverse'>
                          {waiting ? (
                            <Spinner animation="border" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </Spinner>
                          ) : (
                            <div>
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
                                onClick={() => denyAccess(item)}
                                variant="outline-danger"
                              >
                                <RxCross2></RxCross2>
                              </Button>
                            </div>
                          )}
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

export default ClassListPage;
