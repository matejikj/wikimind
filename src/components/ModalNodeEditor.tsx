import React, { useContext } from "react";
import { Col, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { MindMapDataset } from "../models/types/MindMapDataset";
import { Node } from "../models/types/Node";
import { generate_uuidv4 } from "../service/utils";
import '../styles/style.css';
import modalsLocalization from "./locales/modals.json";
import { SessionContext } from "../sessionContext";

/**
 * Represents the ModalNodeEditor component for editing and adding nodes in a Mind Map dataset.
 * This component displays a modal dialog with input fields to edit or create a new node in the dataset.
 */
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

    // Access the session context to get session information
    const sessionContext = useContext(SessionContext);

    /**
     * Handles the save action when the user clicks the "Add node" button in the modal.
     * This function updates the dataset with the new or edited node information and handles linking nodes if necessary.
     * It also triggers the canvas update.
     * @param event The click event object
     */
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
                <Modal.Title>
                    {modalsLocalization.addNewNode[sessionContext.sessionInfo.localization]}
                </Modal.Title>
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
                {/* Button to cancel the editing */}
                <Button variant="secondary" onClick={() => setModal(false)}>
                    {modalsLocalization.cancel[sessionContext.sessionInfo.localization]}
                </Button>
                {/* Button to save the node */}
                <Button variant="primary" onClick={handleSave}>
                    {modalsLocalization.add[sessionContext.sessionInfo.localization]}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalNodeEditor;
