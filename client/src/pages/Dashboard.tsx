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

  const [name, setName] = useState("");
  const [showMindMapRenameModal, setShowMindMapRenameModal] = useState(false);
  const [showMindMapDeleteModal, setShowMindMapDeleteModal] = useState(false);
  const [mindMapToChange, setMindMapToChange] = useState<MindMap | undefined>();

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
    navigate('/editor/', {
      state: {
        id: url
      }
    })
  }

  async function renameMindMap(name: string) {
    if (mindMapToChange) {
      mindMapToChange.name = name
      const renamePromise = await mindMapService.updateMindMap(mindMapToChange)
      if (renamePromise) {
        const newArray = [...mindMapList];
        const objectToUpdate = newArray.find(obj => obj.id === mindMapToChange.id);
        if (objectToUpdate) {
          objectToUpdate.name = name;
        }
        setMindMapList(newArray)
        setShowMindMapRenameModal(false)
      }
    }

  }

  async function removeMindMap() {
    if (mindMapToChange) {
      const removePromise = await mindMapService.removeMindMap(mindMapToChange)
      if (removePromise) {
        setMindMapList((mindMapList) =>
          mindMapList.filter((item) => item.id !== mindMapToChange.id)
        )
        setShowMindMapDeleteModal(false)
      }
    }
  }

  async function createNew() {
    const mindMapUrl = await mindMapService.createNewMindMap(name, sessionContext.sessionInfo)
    if (mindMapUrl) {
      navigate('/editor/', {
        state: {
          id: mindMapUrl
        }
      })
    }
  }

  return (
    <div className="App">
      <Sidenav />
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
            <Button variant="primary" onClick={createNew}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showMindMapDeleteModal}>
          <Modal.Header>
            <Modal.Title>Really want to delete mindMap?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button
              className='my-btn'
              variant="secondary" onClick={() => setShowMindMapDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              className='my-btn'
              variant="secondary" onClick={() => removeMindMap()}>
              Confirm
            </Button>


          </Modal.Footer>
        </Modal>
        <Modal show={showMindMapRenameModal}>
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
              variant="secondary" onClick={() => setShowMindMapRenameModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => renameMindMap(name)}>
              Confirm
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
                      onClick={() => {
                        setMindMapToChange(item);
                        setShowMindMapDeleteModal(true)
                      }}
                      variant="success"
                    >
                      <MdDeleteForever></MdDeleteForever>
                    </Button>

                    <Button
                      size='sm'
                      className='class-btn rounded-circle'
                      onClick={() => {
                        setMindMapToChange(item);
                        setShowMindMapRenameModal(true)
                      }}
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
