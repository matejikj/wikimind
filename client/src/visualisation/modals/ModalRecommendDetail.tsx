import { useEffect, useState } from "react";
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

const ModalRecommendDetail: React.FC<{
    node: Node | undefined,
    showModal: boolean,
    setModal: Function
}> = ({ node, showModal, setModal }) => {

    const [mounted, setMounted] = useState(false); // <-- new state variable

    useEffect(() => {
        setMounted(true); // set the mounted state variable to true after the component mounts
    }, []);

    useEffect(
        () => {

            if (mounted) {
                if (node) {
                    console.log('AHOOOOOOOOOJ')
                }
            }
        }, [mounted])

    return (
        <Modal
            show={showModal}
        >
            <Modal.Header closeButton>
                <Modal.Title>Create custom node</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
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

export default ModalRecommendDetail;
