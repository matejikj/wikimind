import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { generate_uuidv4 } from "../../service/utils";
import Container from 'react-bootstrap/Container';
import { Col, Row } from "react-bootstrap";
import '../../styles/style.css';
import { MindMapDataset } from "../../models/types/MindMapDataset";
import { Node } from "../../models/types/Node";
import { node } from "prop-types";

const blankFormInput = {
    title: '',
    description: ''
}

const ModalNodeEditor: React.FC<{
    node: Node | undefined,
    setNode: Function,
    dataset: MindMapDataset | undefined,
    setDataset: Function,
    showModal: boolean,
    setModal: Function
}> = ({ node, setNode, dataset, setDataset, showModal, setModal }) => {
    const [formInputs, setFormInputs] = useState(blankFormInput);

    async function handleSave(event: any) {
        if (dataset) {

            // updateCanvasAxis(dataset)
            // if (clickedNode) {
            //     dataset.links.push({
            //         id: generate_uuidv4(),
            //         from: clickedNode.id,
            //         to: newId,
            //         source: [clickedNode.cx, clickedNode.cy],
            //         target: [newX, newY]
            //     })
            // }
            setDataset({
                ...dataset,
                mindMap: {
                    ...dataset.mindMap,
                    created: Date.now().toString()
                }
            });
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
            <Modal.Header>
                <Modal.Title>Add new Node</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {node &&
                    <Container fluid>
                        <Row>
                            <Col xs={12}>
                                <Form.Control
                                    type="text"
                                    placeholder="title"
                                    name="title"
                                    value={node.title}
                                    onChange={(e: any) => {
                                        setNode({
                                            node,
                                            title: e.target.value
                                        })
                                    }}
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
                                    rows={12}
                                    placeholder="description"
                                    name="description"
                                    value={node.description}
                                    onChange={(e: any) => {
                                        setNode({
                                            node,
                                            description: e.target.value
                                        })
                                    }}

                                />
                            </Col>
                        </Row>
                    </Container>
                }

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

export default ModalNodeEditor;
