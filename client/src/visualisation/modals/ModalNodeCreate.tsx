import { useContext, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { Node } from '../../models/types/Node'
import { SessionContext } from "../../sessionContext";
import { createNode } from "../../service/mindMapService";
import { generate_uuidv4 } from "../../service/utils";
import { CanvasState } from '../models/CanvasState'
import Container from 'react-bootstrap/Container';
import { Col, Row } from "react-bootstrap";
import ModalHeader from 'react-bootstrap/ModalHeader'

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalNodeCreate: React.FC<{
    datasetName: string,
    clickedNode: Node | undefined,
    canvasState: CanvasState,
    setCanvasState: Function,
    showModal: boolean,
    setModal: Function
}> = ({ datasetName, canvasState, showModal, setModal }) => {
    const theme = useContext(SessionContext)
    const [formInputs, setFormInputs] = useState({
        title: 'title_',
        description: 'description_',
        keyword: ''
    });

    function handleChange(event: any) {
        const key = event.target.name;
        const value = event.target.value;
        setFormInputs({ ...formInputs, [key]: value })
    }

    async function searchKeyword(event: any) {
        try {
            const response = await axios.get(`http://localhost:3006/search?keyword=${formInputs.keyword}`);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    function handleSave(event: any) {
        const newNode: Node = {
            id: generate_uuidv4(),
            title: formInputs.title,
            description: formInputs.description,
            cx: 100,
            cy: 100,
            visible: true
        }
        createNode(datasetName, theme.userData?.session, newNode)
        if (canvasState === CanvasState.ADD_CONNECTED_NODE) {
            // createLink()
        }
    }
    const handleClose = () => setModal(false);

    return (
        <Modal
            show={showModal}
        >
            <Modal.Header closeButton>
                <Modal.Title>Find and add new node</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label htmlFor="inputKeyword">Searching keyword:</Form.Label>
                <Container fluid>
                    <Row>
                        <Col xs={9}>
                            <Form.Control
                                type="text"
                                placeholder="Keyword"
                                name="keyword"
                                value={formInputs.keyword}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col xs={3}>
                            <Button onClick={searchKeyword}>Search</Button>
                        </Col>

                    </Row>
                    <Row>
                        <br />
                    </Row>
                    <Row>
                        <br />
                    </Row>
                </Container>

                {/* <Form.Control
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formInputs.description}
                    onChange={handleChange}
                /> */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>

    );
};

export default ModalNodeCreate;
