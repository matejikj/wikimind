import { useState } from "react";
import { Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { Node } from "../models/types/Node";
import '../styles/style.css';

const blankFormInput = {
    title: '',
    description: ''
}

const ModalNodeDetail: React.FC<{
    node: Node | undefined,
    showModal: boolean,
    setModal: Function
}> = ({ node, showModal, setModal }) => {
    const [formInputs, setFormInputs] = useState(blankFormInput);

    return (
        <Modal
            show={showModal}
            onHide={() => setModal(false)}
        >
            <Modal.Header>
                <Modal.Title>{node?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                    {node?.description}
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setModal(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalNodeDetail;
