import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import Sidenav, { SideNavType } from "../components/Sidenav";
import { getMindMapList } from "../service/containerService";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { createNewMindMap } from '../service/mindMapService';
import { SessionContext } from '../sessionContext';
import { Container, Row, Stack } from 'react-bootstrap';
import { MdDeleteForever, MdDriveFileRenameOutline, MdSlideshow } from 'react-icons/md';
import { ListItem } from '../models/ListItem';
import '../styles/style.css';

const Dashboard: React.FC = () => {
  const [list, setList] = useState<ListItem[]>([]);
  const [createNewModalVisible, setCreateNewModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);

  const [createName, setCreateName] = useState("");
  const [rename, setRename] = useState("");

  const sessionContext = useContext(SessionContext)

  const navigate = useNavigate();

  useEffect(() => {
    const result = getMindMapList(sessionContext.sessionInfo).then((res) => {
      setList(res)
    });
  }, []);


  const showMindMap = (e: ListItem) => {
    navigate('/visualisation/', {
      state: {
        id: e.url
      }
    })
  }

  const renameMindMap = (e: ListItem) => {

  }

  const removeMindMap = (e: ListItem) => {
    // navigate('/visualisation/', {
    //   state: {
    //     id: e.target.name
    //   }
    // })
  }

  const createNew = (e: any) => {
    if (sessionContext.sessionInfo.isLogged) {
      createNewMindMap(createName, sessionContext.sessionInfo).then((res) => {
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
                value={createName}
                onChange={(e) => { setCreateName(e.target.value) }}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className='my-btn'
              variant="secondary" onClick={() => setCreateNewModalVisible(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={createNew}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={renameModalVisible} onHide={() => setRenameModalVisible(false)}>
          <Modal.Header>
            <Modal.Title>Choose name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Control
                type="text"
                placeholder="insert name"
                aria-label="insert name"
                value={createName}
                onChange={(e) => { setCreateName(e.target.value) }}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className='my-btn'
              variant="secondary" onClick={() => setCreateNewModalVisible(false)}>
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
                <div className='aaa'>
                  <div className='my-stack'>
                    {item.title}
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
                      onClick={() => renameMindMap(item)}
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
          <Stack direction='horizontal'>
            <Button onClick={() => setCreateNewModalVisible(true)} variant="outline-success">Create new</Button>
          </Stack>
        </Container>
      </main>
    </div>

  );
};

export default Dashboard;
