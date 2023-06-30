import { useContext, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Node } from '../../models/types/Node'
import { SessionContext } from "../../sessionContext";
import { MindMapDataset } from "../../models/types/MindMapDataset";

const ModalNodeDetail: React.FC<{
    datasetName: MindMapDataset | undefined,
    clickedNode: Node | undefined,
    showModal: boolean,
    setModal: Function
}> = ({ datasetName, clickedNode, showModal, setModal }) => {
    const theme = useContext(SessionContext)
    const [formInputs, setFormInputs] = useState({
        title: clickedNode?.title,
        description: clickedNode?.description
    });

    function handleChange(event: any) {
        const key = event.target.name;
        const value = event.target.value;
        setFormInputs({ ...formInputs, [key]: value })
    }

    const handleClose = () => setModal(false);

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
            <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

    );
};

export default ModalNodeDetail;
