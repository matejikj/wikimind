import { useEffect, useState } from "react";
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

    const [mounted, setMounted] = useState(false); // <-- new state variable

    useEffect(() => {
        setMounted(true); // set the mounted state variable to true after the component mounts
    }, []);

    useEffect(
        () => {

            if (mounted) {
                if (node) {
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

export default ModalNodeDetail;
