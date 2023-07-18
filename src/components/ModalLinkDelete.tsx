import React, { useEffect, useState, useContext } from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { Node } from "../models/types/Node";
import '../styles/style.css';
import modalsLocalization from "./locales/modals.json";
import { SessionContext } from "../sessionContext";

/**
 * Represents the ModalLinkDelete component for deleting a link associated with a node.
 * This component displays a modal dialog to confirm the deletion of the link.
 */
const ModalLinkDelete: React.FC<{
    node: Node | undefined,
    showModal: boolean,
    setModal: Function
}> = ({ node, showModal, setModal }) => {

    // Access the session context to get session information
    const sessionContext = useContext(SessionContext);

    return (
        <Modal
            show={showModal}
        >
            <Modal.Header closeButton>
                {/* Display the title of the modal based on the session context localization */}
                <Modal.Title>
                    {modalsLocalization.dashboard[sessionContext.sessionInfo.localization]}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display the content for link deletion confirmation */}
                <Container fluid>
                    {/* Add content here to confirm link deletion */}
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

export default ModalLinkDelete;
