import { Col, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { MindMapDataset } from "../models/types/MindMapDataset";
import { Node } from "../models/types/Node";
import '../styles/style.css';
import { generate_uuidv4 } from "../service/utils";
import { item } from "rdf-namespaces/dist/fhir";
import { useState } from "react";

const ModalNodeEditor: React.FC<{
    clickedNode: Node | undefined,
    node: Node | undefined,
    setNode: Function,
    dataset: MindMapDataset | undefined,
    setDataset: Function,
    updateCanvasAxis: Function,
    showModal: boolean,
    setModal: Function
}> = ({ clickedNode, updateCanvasAxis, node, setNode, dataset, setDataset, showModal, setModal }) => {

    async function handleSave(event: any) {
        if (dataset && node) {
            if (node.id === "") {
                const newId = generate_uuidv4()
                node.id = newId
                dataset.nodes.push(node)
            } 
            const selectedNode = dataset.nodes.find((item) => item.id === node.id)
            if (selectedNode) {
                if (clickedNode && clickedNode.id !== node.id) {
                    dataset.links.push({
                        id: generate_uuidv4(),
                        from: clickedNode.id,
                        to: selectedNode.id,
                        source: [clickedNode.cx, clickedNode.cy],
                        target: [node.cx, node.cy]
                    })
                }
                selectedNode.title = node.title
                selectedNode.description = node.description
                setDataset({
                    ...dataset,
                    mindMap: {
                        ...dataset.mindMap,
                        created: Date.now().toString()
                    }
                });
                updateCanvasAxis(dataset)
            }            
        }
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
                                            ...node,
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
                                            ...node,
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
