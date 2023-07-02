import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { generate_uuidv4 } from "../../service/utils";
import Container from 'react-bootstrap/Container';
import { Col, Row } from "react-bootstrap";
import '../../styles/style.css';
import { MindMapDataset } from "../../models/types/MindMapDataset";

const blankFormInput = {
    title: '',
    description: ''
}

const ModalNodeCreate: React.FC<{
    dataset: MindMapDataset | undefined,
    setDataset: Function,
    showModal: boolean,
    setModal: Function
}> = ({ dataset, setDataset, showModal, setModal }) => {
    const [formInputs, setFormInputs] = useState(blankFormInput);

    function handleChange(event: any) {
        const key = event.target.name;
        const value = event.target.value;
        setFormInputs({ ...formInputs, [key]: value })
    }

    async function handleSave(event: any) {
        if (dataset) {
            dataset.nodes.push({
                id: generate_uuidv4(),
                uri: '',
                title: formInputs.title,
                description: formInputs.description,
                cx: 100,
                cy: 100,
                isInTest: false,
                color: '#8FBC8F',
                textColor: "black"
            })
            setDataset({
                ...dataset,
                created: '1.7.2023 21:08:08'
            });
        }
        setFormInputs(blankFormInput)
        setModal(false)
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
