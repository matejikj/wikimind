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
import { Accordion, Col, Row } from "react-bootstrap";
import '../../styles/style.css';

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalNodeCreate: React.FC<{
    datasetName: string,
    showModal: boolean,
    setModal: Function
}> = ({ datasetName, showModal, setModal }) => {
    const sessionContext = useContext(SessionContext)
    const [formInputs, setFormInputs] = useState({
        title: '',
        description: '',
        keyword: ''
    });
    const [results, setResults] = useState<{ title: string; comment: any; }[]>([]);

    function handleChange(event: any) {
        const key = event.target.name;
        const value = event.target.value;
        setFormInputs({ ...formInputs, [key]: value })
    }

    const searchTerm = 'musk';
    const language = 'en';


    async function searchKeyword(event: any) {
        const url = "https://lookup.dbpedia.org/api/search?label=" + formInputs.keyword
        axios.get("https://lookup.dbpedia.org/api/search", {
            params: {
                format: 'json',
                label: formInputs.keyword,
                languages: language
            },
            headers: {
                Accept: 'application/json'
            }
        })
            .then(response => {
                // Handle the response data
                let a = response.data.docs.slice(0, 30)
                a = a.map((item: any) => {
                    return {
                        title: item.label === undefined ? '' : item.label[0].replace('<B>', '').replace('</B>', ''),
                        comment: item.comment === undefined ? '' : item.comment[0]
                    }
                })
                setResults(a)
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });
    }

    function handleSave(event: any) {
        const newNode: Node = {
            id: generate_uuidv4(),
            uri: '',
            title: formInputs.title,
            description: formInputs.description,
            cx: 100,
            cy: 100,
            visible: true
        }
        createNode(datasetName, sessionContext.sessionInfo, newNode)
    }

    return (
        <Modal
            show={showModal}
        >
            <Modal.Header closeButton>
                <Modal.Title>Create custom node</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col xs={6}>
                            <Form.Control
                                type="text"
                                placeholder="title"
                                name="title"
                                value={formInputs.title}
                                onChange={handleChange}
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
                                rows={4}
                                placeholder="description"
                                name="description"
                                value={formInputs.description}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>
                </Container>
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

export default ModalNodeCreate;
