import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { MindMapService } from '../service/mindMapService';
import { SessionContext } from '../sessionContext';
import { Container, Row, Stack } from 'react-bootstrap';
import { MdDeleteForever, MdDriveFileRenameOutline, MdSlideshow } from 'react-icons/md';
import { ListItem } from '../models/ListItem';
import '../styles/style.css';
import { MindMap } from '../models/types/MindMap';
import { MINDMAPS, TTLFILETYPE, WIKIMIND } from '../service/containerService';

const Dashboard: React.FC = () => {
  const [mindMapList, setMindMapList] = useState<MindMap[]>([]);
  const [createNewModalVisible, setCreateNewModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);

  const [createName, setCreateName] = useState("");
  const [rename, setRename] = useState("");

  const sessionContext = useContext(SessionContext)

  const navigate = useNavigate();

  const mindMapService = new MindMapService();

  async function fetchMindMapList(): Promise<void> {
    try {
      const mindMaps = await mindMapService.getMindMapList(sessionContext.sessionInfo.podUrl);
      mindMaps && setMindMapList(mindMaps)
    } catch (error) {
      // Handle the error, e.g., display an error message to the user or perform fallback actions
    }
  }

  useEffect(() => {
    fetchMindMapList();
  }, []);

  function showMindMap(mindMap: MindMap): void {
    const url = `${sessionContext.sessionInfo.podUrl}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`
    navigate('/visualisation/', {
      state: {
        id: url
      }
    })
  }

  const renameMindMap = (e: MindMap) => {

  }

  const removeMindMap = (e: MindMap) => {
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
      <Sidenav/>
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

          {mindMapList.map((item, index) => {
            return (
              <Row key={index}>
                <div className='aaa'>
                  <div className='my-stack'>
                    {item.name}
                  </div>
                  <div className='my-stack-reverse'>
                    <Button
                      size='sm'
                      className='class-btn rounded-circle'
                      onClick={() => removeMindMap(item)}
                      variant="success"
                    >
                      <MdDeleteForever></MdDeleteForever>
                    </Button>

                    <Button
                      size='sm'
                      className='class-btn rounded-circle'
                      onClick={() => renameMindMap(item)}
                      variant="success"
                    >
                      <MdDriveFileRenameOutline></MdDriveFileRenameOutline>
                    </Button>

                    <Button
                      size='sm'
                      className='class-btn rounded-circle'
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
