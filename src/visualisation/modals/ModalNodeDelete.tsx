import { useContext, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { MindMapDataset } from "../../models/types/MindMapDataset";
import { Node } from '../../models/types/Node';
import { generate_uuidv4 } from "../../service/utils";
import { SessionContext } from "../../sessionContext";

const ModalNodeDelete: React.FC<{
    datasetName: MindMapDataset | undefined,
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
            uri: '',
            title: formInputs.title,
            description: formInputs.description,
            cx: 100,
            cy: 100,
            isInTest: true,
            color: "#8FBC8F",
            textColor: "black"
        }
        // deleteNode(datasetName, theme.sessionInfo, newNode)
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

export default ModalNodeDelete;
