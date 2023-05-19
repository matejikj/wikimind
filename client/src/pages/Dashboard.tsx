import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import Sidenav, { SideNavType } from "../components/Sidenav";
import { getMindMapList } from "../service/containerService";
import Button from 'react-bootstrap/Button';
import { generate_uuidv4 } from "../service/utils";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import './Dashboard.css';
import { createNewMindMap } from '../service/mindMapService';
import { SessionContext } from '../sessionContext';
import { Card, Col, Container, Row, Stack } from 'react-bootstrap';

const Dashboard: React.FC = () => {
  const [list, setList] = useState<{ url: string; title: string | null }[]>([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const theme = useContext(SessionContext)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  useEffect(() => {
    const result = getMindMapList().then((res) => {
      setList(res)
    });

  }, []);

  const showMindMap = (e: any) => {
    console.log(e.target.name)
    navigate('/visualisation/', {
      state: {
        id: e.target.name
      }
    })
  }
  const removeMindMap = (e: any) => {
    console.log(e.target.name)
    // navigate('/visualisation/', {
    //   state: {
    //     id: e.target.name
    //   }
    // })
  }

  const createNew = (e: any) => {
    if (theme.sessionInfo.isLogged) {
      createNewMindMap(name, theme.sessionInfo.webId).then((res) => {
        console.log(res)
        navigate('/visualisation/', {
          state: {
            id: res
          }
        })
      })
    }
  }

  return (
    <div className="App">
      <Sidenav type={SideNavType.COMMON} />
      <main className='dashboard-main'>
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
            <Button
              className='my-btn'
              variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={createNew}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Container>
          <Row>
            <h1>Your mind maps!</h1>
          </Row>

          {list.map((item, index) => {
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
      </main>
    </div>

  );
};

export default Dashboard;
