import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import Sidenav, { SideNavType } from "../components/Sidenav";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import './Login.css';
import { SessionContext } from '../sessionContext';
import { allowAccess, createNewClass, denyRequest, getClassesList, getRequests, requestClass } from '../service/classService';
import { Class } from '../models/types/Class';
import { Card, Col, Container, Row, Stack } from 'react-bootstrap';
import { Request } from '../models/types/Request';
import { MdDeleteForever, MdSlideshow } from 'react-icons/md';
import { RxCheck, RxCross2 } from 'react-icons/rx';

const authOptions = {
  clientName: "Learnee",
};

const Classes: React.FC = () => {
  const [list, setList] = useState<Class[]>([]);
  const [requestsCount, setRequestsCount] = useState(0);
  const [show, setShow] = useState(false);
  const [request, setRequest] = useState(false);
  const [requestUrl, setRequestUrl] = useState("");
  const [name, setName] = useState("");
  const sessionContext = useContext(SessionContext)
  const [requests, setRequests] = useState<Request[]>([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();
  const wssUrl = new URL(sessionContext.sessionInfo.podUrl);
  wssUrl.protocol = 'wss';

  // const [mounted, setMounted] = useState(false); // <-- new state variable

  // useEffect(() => {
  //   setMounted(true); // set the mounted state variable to true after the component mounts
  // }, []);


  useEffect(() => {
    const result = getClassesList(sessionContext.sessionInfo).then((res) => {
      setList(res)
    });
    getRequests(sessionContext.sessionInfo).then((aaa) => {
      setRequests(aaa)
    });
    const podUrl = sessionContext.sessionInfo.podUrl + 'Wikie/classes/classes.ttl'

    // const socket = new WebSocket(wssUrl, ['solid-0.1']);
    // socket.onopen = function () {
    //   this.send(`sub ${podUrl}`);
    // };
    // socket.onmessage = function (msg) {
    //   if (msg.data && msg.data.slice(0, 3) === 'pub') {
    //     if (msg.data === `pub ${podUrl}`) {
    //       const result = getClassesList(sessionContext.sessionInfo).then((res) => {
    //         setList(res)
    //       });
    //       getRequests(sessionContext.sessionInfo).then((aaa) => {
    //         setRequests(aaa)
    //       });
    //     }
    //   }
    // };
    // const websocket4 = new WebsocketNotification(
    //   podUrl,
    //   { fetch: fetch }
    // );
    // websocket4.on("message", (e: any) => {
    //   const result = getClassesList(sessionContext.sessionInfo).then((res) => {
    //     setList(res)
    //   });
    //   getRequests(sessionContext.sessionInfo).then((aaa) => {
    //     setRequests(aaa)
    //   });
    // });
    // websocket4.connect();

  }, []);

  useEffect(() => {

  }, []);

  const showClass = (e: Class) => {
    const name = e.storage + 'Wikie/classes/' + e.id + '.ttl'
    navigate('/class/', {
      state: {
        url: name
      }
    })
  }

  const deleteClass = (e: any) => {
    console.log(e.target.name)
    // navigate('/class/', {
    //   state: {
    //     url: e.target.name
    //   }
    // })
  }

  const allowRequest = (e: any) => {
    console.log(e.target.name)
    const aa = requests.find((item) => { return item.requestor === e.target.name })
    if (aa !== undefined) {
      allowAccess(sessionContext.sessionInfo, aa)
    }

    // navigate('/class/', {
    //   state: {
    //     url: e.target.name
    //   }
    // })
  }

  const denyAccess = (e: any) => {
    console.log(e.target.name)
    const aa = requests.find((item) => { return item.requestor === e.target.name })
    if (aa !== undefined) {
      denyRequest(sessionContext.sessionInfo, aa)
    }
  }

  const sendRequest = (e: any) => {
    requestClass(sessionContext.sessionInfo, requestUrl)
  }

  const createNew = (e: any) => {
    if (sessionContext.sessionInfo.isLogged) {
      createNewClass(name, sessionContext.sessionInfo).then((res) => {
        console.log(res)
      })
    }
  }

  return (
    <div className="App">
      <Sidenav type={SideNavType.COMMON} />
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

          {list.map((item, index) => {
            return (
              <Row key={index}>
                <div className='aaa'>
                  <div className='my-stack'>
                    {item.name}
                  </div>
                  <div className='my-stack-reverse'>
                    <Button
                      className='class-btn'
                      onClick={() => deleteClass(item)}
                      variant="primary"
                    >
                      <MdDeleteForever></MdDeleteForever>
                    </Button>

                    <Button
                      className='class-btn'
                      onClick={() => showClass(item)}
                      variant="primary"
                    >
                      <MdSlideshow></MdSlideshow>
                    </Button>

                  </div>

                </div>
              </Row>
            )
          })}


          {/* {list.map((item, index) => {
            return (
              <Row key={index}>
                <Col sm={9}>{item.name}</Col>
                <Col sm={3}>

                  <Stack direction="horizontal" gap={2}>
                    <div>
                      <Button
                        className='class-btn'
                        onClick={() => showClass(item)}
                        variant="primary"
                      >
                        Show
                      </Button>
                      <br />
                    </div>
                    <div>
                      <Button
                        className='class-btn'
                        onClick={() => deleteClass(item)}
                        variant="primary"
                      >
                        Remove</Button>
                      <br />
                    </div>

                  </Stack>
                </Col>
              </Row>
            )
          })} */}
          <Row>

            {request ?
              <Stack direction="horizontal" gap={1}>
                <Form.Control
                  // style={{ maxWidth: '500px' }}
                  type="text"
                  id="inputPassword5"
                  value={requestUrl}
                  name="id"
                  style={{ maxWidth: '600px' }}
                  onChange={(e) => { setRequestUrl(e.target.value) }}
                />
                <Button
                  onClick={sendRequest}
                  variant="success"
                >
                  Request
                </Button>
                <Button
                  onClick={() => { setRequest(false) }}
                  variant="danger"
                >
                  Cancel
                </Button>
              </Stack> :
              <Stack direction="horizontal" gap={1}>
                <Button onClick={handleShow} variant="primary">Create new class</Button>
                <Button onClick={() => { setRequest(true) }} variant="success">Add class</Button>
              </Stack>
            }
          </Row>
          <Row>
            <Col sm="12">
              <Card className="class-card">
                <Container>
                  <Row>
                    <h4>Requests</h4>
                    {requests.length === 0 &&
                      <p>No requests already</p>
                    }

                  </Row>
                  {requests.map((item, index) => {
                    return (
                      <Row key={index}>
                        <Col sm={9}>{item.requestor}</Col>
                        <Col sm={3}>

                          <Stack direction="horizontal" gap={2}>
                            <div>
                              <Button
                                className='class-btn'
                                name={item.requestor}
                                onClick={allowRequest}
                                variant="success"
                              >
                                <RxCheck></RxCheck>
                              </Button>
                              <br />
                            </div>
                            <div>
                              <Button
                                className='class-btn'
                                name={item.requestor}
                                onClick={denyAccess}
                                variant="outline-danger"
                              >
                                <RxCross2></RxCross2>
                              </Button>
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

  );
};

export default Classes;
