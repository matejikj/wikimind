import React, { useContext } from "react";
import { Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { Node } from "../models/types/Node";
import '../styles/style.css';
import modalsLocalization from "./locales/modals.json";
import { SessionContext } from "../sessionContext";

/**
 * Represents the ModalNodeDetail component to display node details in a modal dialog.
 * This component shows the title and description of the provided node within a Bootstrap modal.
 */
const ModalNodeDetail: React.FC<{
    node: Node | undefined,
    showModal: boolean,
    setModal: Function
}> = ({ node, showModal, setModal }) => {

    // Access the session context to get session information
    const sessionContext = useContext(SessionContext);

    return (
        <Modal
            show={showModal}
            onHide={() => setModal(false)}
        >
            <Modal.Header>
                {/* Display the node title as the modal title */}
                <Modal.Title>{node?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        {/* Display the node description */}
                        {node?.description}
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                {/* Button to close the modal */}
                <Button variant="secondary" onClick={() => setModal(false)}>
                    {modalsLocalization.close[sessionContext.sessionInfo.localization]}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalNodeDetail;
