import { useContext, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Node } from '../../models/types/Node'
import { SessionContext } from "../../sessionContext";
import { createNode } from "../../service/mindMapService";
import { generate_uuidv4 } from "../../service/utils";
import Container from 'react-bootstrap/Container';
import { Col, Row } from "react-bootstrap";
import '../../styles/style.css';
import { MindMapDataset } from "../../models/types/MindMapDataset";

const ModalNodeCreate: React.FC<{
    dataset: MindMapDataset | undefined,
    showModal: boolean,
    setModal: Function
}> = ({ dataset, showModal, setModal }) => {
    const sessionContext = useContext(SessionContext)
    const [formInputs, setFormInputs] = useState({
        title: '',
        description: '',
    });

    function handleChange(event: any) {
        const key = event.target.name;
        const value = event.target.value;
        setFormInputs({ ...formInputs, [key]: value })
    }

    async function handleSave(event: any) {
        const newNode: Node = {
            id: generate_uuidv4(),
            uri: '',
            title: formInputs.title,
            description: formInputs.description,
            cx: 100,
            cy: 100,
            visible: true,
            color: '#8FBC8F'
        }
        createNode(dataset?.id, sessionContext.sessionInfo, newNode)
    }

    return (
        <Modal
            show={showModal}
        >
            <Modal.Header closeButton>
                <Modal.Title>Create custom node</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col xs={6}>
                            <Form.Control
                                type="text"
                                placeholder="title"
                                name="title"
                                value={formInputs.title}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <br />
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="description"
                                name="description"
                                value={formInputs.description}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Add node
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalNodeCreate;
