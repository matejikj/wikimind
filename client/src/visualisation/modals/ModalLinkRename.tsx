import { useContext, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Connection } from '../../models/types/Connection'
import { SessionContext } from "../../sessionContext";
import { addNewLink } from "../../service/mindMapService";
import { CanvasState } from '../models/CanvasState'
import { MindMapDataset } from "../../models/types/MindMapDataset";

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalLinkRename: React.FC<{
    datasetName: MindMapDataset | undefined,
    clickedLink: Connection | undefined,
    canvasState: CanvasState,
    setCanvasState: Function,
    showModal: boolean,
    setModal: Function
}> = ({     datasetName, clickedLink, canvasState, setCanvasState, showModal, setModal }) => {
    const sessionContext = useContext(SessionContext)
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
        
        if (clickedLink !== undefined) {
            clickedLink.title = formInputs.title
            addNewLink(datasetName?.id, sessionContext.sessionInfo, clickedLink)
        }
        setModal(false)
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
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSave}>Add</Button>
            </Modal.Footer>
        </Modal>

    );
};

export default ModalLinkRename;
