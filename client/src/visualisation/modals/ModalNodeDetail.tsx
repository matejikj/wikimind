import { useContext, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { Node } from '../../models/types/Node'
import { SessionContext } from "../../sessionContext";
import { createNode } from "../../service/mindMapService";
import { generate_uuidv4 } from "../../service/utils";
import { CanvasState } from '../models/CanvasState'

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalNodeDetail: React.FC<{
    datasetName: string,
    clickedNode: Node | undefined,
    showModal: boolean,
    setModal: Function
}> = ({ datasetName, clickedNode, showModal, setModal }) => {
    const theme = useContext(SessionContext)
    const [formInputs, setFormInputs] = useState({
        title: 'title_',
        description: 'description_'
    });

    function handleChange(event: any) {
        const key = event.target.name;
        const value = event.target.value;
        setFormInputs({ ...formInputs, [key]: value })
    }
    function handleSave(event: any) {
        const newNode: Node = {
            id: generate_uuidv4(),
            title: formInputs.title,
            description: formInputs.description,
            cx: 100,
            cy: 100
        }
        createNode(datasetName, theme.userData?.session, newNode)
    }

    return (
        <Modal
            show={showModal}
        >
            <Modal.Body>
                <Form.Label htmlFor="inputKeyword">Searching keyword:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={formInputs.title}
                    onChange={handleChange}
                />
                <Form.Control
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formInputs.description}
                    onChange={handleChange}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSave}>Add</Button>
            </Modal.Footer>
        </Modal>

    );
};

export default ModalNodeDetail;
