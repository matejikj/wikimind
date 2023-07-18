import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import Sidenav from "../components/Sidenav";
import dashboardLocalization from "./locales/dashboard.json";

import { Container, Row, Stack } from 'react-bootstrap';
import { MdDeleteForever, MdDriveFileRenameOutline, MdSlideshow } from 'react-icons/md';
import { MindMap } from '../models/types/MindMap';
import { MINDMAPS, TTLFILETYPE, WIKIMIND } from '../service/containerService';
import { MindMapService } from '../service/mindMapService';
import { SessionContext } from '../sessionContext';
import '../styles/style.css';

/**
 * Represents the MinaMapListPage component displaying a list of mind maps and their actions.
 */
const MinaMapListPage: React.FC = () => {
  // Access the SessionContext to get the user's session information.
  const sessionContext = useContext(SessionContext);
  
  // Access the navigation hook from react-router-dom.
  const navigate = useNavigate();

  // State to hold the list of mind maps.
  const [mindMapList, setMindMapList] = useState<MindMap[]>([]);

  // State to hold the name for a new mind map or the renamed mind map.
  const [name, setName] = useState("");

  // States to control modals for renaming, deleting, and creating new mind maps.
  const [showMindMapRenameModal, setShowMindMapRenameModal] = useState(false);
  const [showMindMapDeleteModal, setShowMindMapDeleteModal] = useState(false);
  const [createNewModalVisible, setCreateNewModalVisible] = useState(false);

  // State to hold the mind map to be updated (renamed or deleted).
  const [mindMapToChange, setMindMapToChange] = useState<MindMap | undefined>();

  // Create an instance of the MindMapService to interact with the mind map data.
  const mindMapService = new MindMapService();

  /**
   * Fetches the list of mind maps from the backend API.
   */
  async function fetchMindMapList(): Promise<void> {
    try {
      const mindMaps = await mindMapService.getMindMapList(sessionContext.sessionInfo.podUrl);
      mindMaps && setMindMapList(mindMaps);
    } catch (error) {
      // Handle the error, e.g., display an error message to the user or perform fallback actions.
    }
  }

  // Fetch the list of mind maps on component mount.
  useEffect(() => {
    fetchMindMapList();
  }, []);

  /**
   * Redirects to the mind map editor to display the selected mind map.
   * @param mindMap - The selected mind map.
   */
  function showMindMap(mindMap: MindMap): void {
    const url = `${sessionContext.sessionInfo.podUrl}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`;
    navigate('/editor/', {
      state: {
        id: url
      }
    });
  }

  /**
   * Renames the selected mind map.
   * @param name - The new name for the mind map.
   */
  async function renameMindMap(name: string): Promise<void> {
    if (mindMapToChange) {
      mindMapToChange.name = name;
      const renamePromise = await mindMapService.updateMindMap(mindMapToChange);
      if (renamePromise) {
        const newArray = [...mindMapList];
        const objectToUpdate = newArray.find(obj => obj.id === mindMapToChange.id);
        if (objectToUpdate) {
          objectToUpdate.name = name;
        }
        setMindMapList(newArray);
        setShowMindMapRenameModal(false);
      }
    }
  }

  /**
   * Removes the selected mind map.
   */
  async function removeMindMap(): Promise<void> {
    if (mindMapToChange) {
      const removePromise = await mindMapService.removeMindMap(mindMapToChange);
      if (removePromise) {
        setMindMapList((mindMapList) =>
          mindMapList.filter((item) => item.id !== mindMapToChange.id)
        );
        setShowMindMapDeleteModal(false);
      }
    }
  }

  /**
   * Creates a new mind map with the specified name.
   */
  async function createNew(): Promise<void> {
    const mindMapUrl = await mindMapService.createNewMindMap(name, sessionContext.sessionInfo);
    if (mindMapUrl) {
      navigate('/editor/', {
        state: {
          id: mindMapUrl
        }
      });
    }
  }

  return (
    <div className="App">
      {/* The Sidenav component displaying navigation options */}
      <Sidenav />
      <main className='dashboard-main'>
        {/* Modal for creating a new mind map */}
        <Modal show={createNewModalVisible} onHide={() => setCreateNewModalVisible(false)}>
          <Modal.Header>
            <Modal.Title>{dashboardLocalization.chooseName[sessionContext.sessionInfo.localization]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Control
                type="text"
                placeholder={dashboardLocalization.insert[sessionContext.sessionInfo.localization]}
                value={name}
                onChange={(e) => { setName(e.target.value) }}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className='my-btn'
              variant="secondary" onClick={() => setCreateNewModalVisible(false)}>
              {dashboardLocalization.close[sessionContext.sessionInfo.localization]}
            </Button>
            <Button variant="primary" onClick={createNew}>
              {dashboardLocalization.create[sessionContext.sessionInfo.localization]}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for deleting a mind map */}
        <Modal show={showMindMapDeleteModal}>
          <Modal.Header>
            <Modal.Title>{dashboardLocalization.delete[sessionContext.sessionInfo.localization]}</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button
              className='my-btn'
              variant="secondary" onClick={() => setShowMindMapDeleteModal(false)}>
              {dashboardLocalization.cancel[sessionContext.sessionInfo.localization]}
            </Button>
            <Button
              className='my-btn'
              variant="secondary" onClick={() => removeMindMap()}>
              {dashboardLocalization.confirm[sessionContext.sessionInfo.localization]}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for renaming a mind map */}
        <Modal show={showMindMapRenameModal}>
          <Modal.Header>
            <Modal.Title>{dashboardLocalization.chooseName[sessionContext.sessionInfo.localization]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Control
                type="text"
                placeholder={dashboardLocalization.insert[sessionContext.sessionInfo.localization]}
                value={name}
                onChange={(e) => { setName(e.target.value) }}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className='my-btn'
              variant="secondary" onClick={() => setShowMindMapRenameModal(false)}>
              {dashboardLocalization.cancel[sessionContext.sessionInfo.localization]}
            </Button>
            <Button variant="primary" onClick={() => renameMindMap(name)}>
              {dashboardLocalization.confirm[sessionContext.sessionInfo.localization]}
            </Button>
          </Modal.Footer>
        </Modal>

        <Container>
          <Row>
            <h1>{dashboardLocalization.header[sessionContext.sessionInfo.localization]}</h1>
          </Row>

          {/* Render the list of mind maps */}
          {mindMapList.map((item, index) => {
            return (
              <Row key={index}>
                <div className='aaa'>
                  <div className='my-stack'>
                    {item.name}
                  </div>
                  <div className='my-stack-reverse'>
                    {/* Button to delete a mind map */}
                    <Button
                      size='sm'
                      className='class-btn rounded-circle'
                      onClick={() => {
                        setMindMapToChange(item);
                        setShowMindMapDeleteModal(true);
                      }}
                      variant="success"
                    >
                      <MdDeleteForever></MdDeleteForever>
                    </Button>

                    {/* Button to rename a mind map */}
                    <Button
                      size='sm'
                      className='class-btn rounded-circle'
                      onClick={() => {
                        setMindMapToChange(item);
                        setShowMindMapRenameModal(true);
                      }}
                      variant="success"
                    >
                      <MdDriveFileRenameOutline></MdDriveFileRenameOutline>
                    </Button>

                    {/* Button to view a mind map */}
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

          {/* Button to create a new mind map */}
          <Stack direction='horizontal'>
            <Button onClick={() => setCreateNewModalVisible(true)} variant="outline-success">{dashboardLocalization.create[sessionContext.sessionInfo.localization]}</Button>
          </Stack>
        </Container>
      </main>
    </div>
  );
};

export default MinaMapListPage;
