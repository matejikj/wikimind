import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";
import { getMindMapList } from "../service/containerService";
import Button from 'react-bootstrap/Button';
import { generate_uuidv4 } from "../service/utils";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import './Login.css';
import { createNewMindMap } from '../service/mindMapService';
import { SessionContext } from '../sessionContext';

const authOptions = {
  clientName: "Learnee",
};

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

  const handleClick = (e: any) => {
    console.log(e.target.name)
    navigate('/visualisation/', {
      state: {
        id: e.target.name
      }
    })
  }

  const createNew = (e: any) => {
    if (theme.userData !== null) {
      createNewMindMap(name, theme.userData.session).then((res) => {
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
      <Sidenav props={{ message: "Basic" }} />
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
        <h1>Dashboard</h1>
        <Button onClick={handleShow} variant="primary">Create new</Button>
        {list.map((item, index) => {
          return (
            <div key={index}>
              <Button  name={item.url} onClick={handleClick} variant="primary">{item.title}</Button>
              <br />
            </div>
          )
        })}
      </main>
    </div>

  );
};

export default Dashboard;
