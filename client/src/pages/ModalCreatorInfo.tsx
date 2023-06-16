import { useContext, useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { Node } from '../models/types/Node'
import { SessionContext } from "../sessionContext";
import { createNode } from "../service/mindMapService";
import { generate_uuidv4 } from "../service/utils";
import { CanvasState } from '../visualisation/models/CanvasState'
import { getMindMapList } from "../service/containerService";
import { Col, Row, Stack } from "react-bootstrap";
import { addGraphToClass } from "../service/classService";

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModelClassAdd: React.FC<{
  classUrl: string,
  showModal: boolean,
  setModal: Function

}> = ({ classUrl, showModal, setModal }) => {
  const theme = useContext(SessionContext)
  const [formInputs, setFormInputs] = useState({
    title: 'title_',
    description: 'description_'
  });
  const [list, setList] = useState<{ url: string; title: string | null }[]>([]);
  const sessionContext = useContext(SessionContext)

  useEffect(() => {
    

  }, []);

  function handleChange(event: any) {
  }
  function handleAdd(event: any) {
    addGraphToClass(theme.sessionInfo, event, classUrl)
  }
  const handleClose = () => setModal(false);
  return (
    <Modal
      show={showModal}
    >
      <Modal.Body>
        {list.map((item, index) => {
          return (
            <Row key={index}>
              <Col>
                <Stack direction="horizontal" gap={2}>
                  {item.title}
                  <Button
                    className='class-btn'
                    name={item.url}
                    onClick={() => handleAdd(item.url)}
                    variant="success"
                  >Add</Button>
                </Stack>
              </Col>
            </Row>
          )
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>

  );
};

export default ModelClassAdd;
