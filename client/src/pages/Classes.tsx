import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import Sidenav, { SideNavType } from "../components/Sidenav";
import { getMindMapList } from "../service/containerService";
import Button from 'react-bootstrap/Button';
import { generate_uuidv4 } from "../service/utils";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import './Login.css';
import { createNewMindMap } from '../service/mindMapService';
import { SessionContext } from '../sessionContext';
import { createNewClass, getClassesList } from '../service/classService';
import { Class } from '../models/types/Class';
import { DatasetLink } from '../models/types/DatasetLink';
import { Col, Container, Row, Stack } from 'react-bootstrap';

const authOptions = {
  clientName: "Learnee",
};

const Classes: React.FC = () => {
  const [list, setList] = useState<DatasetLink[]>([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const theme = useContext(SessionContext)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  useEffect(() => {
    const result = getClassesList(theme.sessionInfo.webId).then((res) => {
      setList(res)
    });

  }, []);

  const showClass = (e: any) => {
    console.log(e.target.name)
    navigate('/class/', {
      state: {
        url: e.target.name
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

  const createNew = (e: any) => {
    if (theme.sessionInfo.isLogged) {
      createNewClass(name, theme.sessionInfo.webId).then((res) => {
        console.log(res)
        // navigate('/class/', {
        //   state: {
        //     url: res
        //   }
        // })
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
                <Col sm={9}>{item.id}</Col>
                <Col sm={3}>
                  
                  <Stack direction="horizontal" gap={2}>
                    <div>
                      <Button
                        className='class-btn'
                        name={item.url + "Wikie/classes/" + item.id + ".ttl"}
                        onClick={showClass}
                        variant="primary"
                        >
                          Show
                      </Button>
                      <br />
                    </div>
                    <div>
                      <Button className='class-btn' name={item.url + "Wikie/classes/" + item.id + ".ttl"} onClick={deleteClass} variant="primary">Remove</Button>
                      <br />
                    </div>

                  </Stack>
                </Col>
              </Row>
            )
          })}
          <Button onClick={handleShow} variant="danger">Create new</Button>
        </Container>
      </main>
    </div>

  );
};

export default Classes;
