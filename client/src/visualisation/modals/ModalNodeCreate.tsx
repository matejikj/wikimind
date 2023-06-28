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
    clickedNode: Node | undefined,
    canvasState: CanvasState,
    setCanvasState: Function,
    showModal: boolean,
    setModal: Function
}> = ({ datasetName, canvasState, showModal, setModal }) => {
    const theme = useContext(SessionContext)
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
        createNode(datasetName, theme.sessionInfo.webId, newNode)
        if (canvasState === CanvasState.ADD_CONNECTED_NODE) {
            // createLink()
        }
    }

    function bbb(event: any) {
        console.log(results[event])
        console.log()
        setFormInputs({ ...formInputs, description: results[event].comment, title: results[event].title })
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
                <Container fluid>
                    <Form.Label htmlFor="inputKeyword">Entity info:</Form.Label>

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
                    </Row><Row>
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

                    </Row><Row><br /></Row>
                    <Form.Label htmlFor="inputKeyword">Searching keyword:</Form.Label>

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

                    </Row><Row><br /></Row>
                    <Row>
                        <Accordion className="accordion-class" defaultActiveKey="0">
                            {results.map((item: any, index: any) => {
                                return (
                                    <Accordion.Item key={index} eventKey={index}>
                                        <Accordion.Header>{item.title}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <p>{item.comment}</p>
                                            <Button variant="secondary" onClick={() => { bbb(index) }}>
                                                select
                                            </Button>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )
                            })}
                        </Accordion>
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
