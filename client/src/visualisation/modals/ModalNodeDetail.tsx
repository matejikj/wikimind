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
