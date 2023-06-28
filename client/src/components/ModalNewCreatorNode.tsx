import { useContext, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { SessionContext } from "../sessionContext";
import { AiFillCheckCircle } from "react-icons/ai";
import { Col, Container, Row } from "react-bootstrap";
import '../styles/style.css';
import { ResultItem } from "../models/ResultItem";

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalNewCreatorNode: React.FC<{
    showModal: boolean,
    recommends: any[],
    setModal: Function,
    classUrl: Function
}> = ({ showModal, recommends, setModal, classUrl }) => {
    const sessionContext = useContext(SessionContext)
    const [name, setName] = useState<string>('');
    const [results, setResults] = useState<any[]>([]);
    const [formInputs, setFormInputs] = useState({
        title: '',
    });

    function handleChange(event: any) {
        const key = event.target.name;
        const value = event.target.value;
        setFormInputs({ ...formInputs, [key]: value })
    }

    function addCustomNode() {
        const resultItem: ResultItem = {
            entity: {
                type: "uri",
                value: '',
            },
            type: {
                type: "uri",
                value: 'CUSTOM',
            },
            label: {
                type: "literal",
                "xml:lang": "en",
                value: formInputs.title
            },
        };
        console.log(resultItem)
        classUrl(resultItem)
    }

    function add() {
        const resultItem: ResultItem = {
            entity: {
                type: "uri",
                value: '',
            },
            type: {
                type: "uri",
                value: 'CUSTOM',
            },
            label: {
                type: "literal",
                "xml:lang": "en",
                value: formInputs.title
            },
        };
        console.log(resultItem)
        classUrl(resultItem)
    }


    return (
        <Modal
            show={showModal}
            onHide={() => setModal(false)}
        >
            {/* <Modal.Header>
            <div className="divv">
                    <span className="dotLeft"></span>
                    <span className="dotRight"></span>
                    <span className="textLeft">LEVA ENTIOTA</span>
                    <span className="textRight">PRAVA ENTIOTA</span>

                </div>
            </Modal.Header> */}
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Button
                            className='class-btn'
                            onClick={() => { }}
                            variant="success"
                        >
                            Direct connection
                        </Button>
                    </Row>
                    <Form.Label htmlFor="inputKeyword">My custom connection</Form.Label>
                    <Row>
                        <Col xs={11}>
                            <Form.Control
                                type="text"
                                placeholder="title"
                                name="title"
                                value={formInputs.title}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col xs={1}>
                            <Button
                                className='class-btn'
                                onClick={() => addCustomNode()}
                                variant="success"
                            >
                                <AiFillCheckCircle></AiFillCheckCircle>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <br />
                    </Row>
                    <Form.Label htmlFor="inputKeyword">Recommends:</Form.Label>

                    <Row>
                        <Container className="creator-recommends-container">
                            {recommends.map((item: any, index: any) => {
                                return (
                                    <Row key={index}>
                                        <div className='aaa'>
                                            <div className='my-stack'>
                                                {item.label.value}
                                            </div>
                                            <div className='my-stack-reverse'>
                                                <Button
                                                    size='sm'
                                                    className='class-btn'
                                                    onClick={() => classUrl(item)}
                                                    variant="success"
                                                >
                                                    <AiFillCheckCircle></AiFillCheckCircle>
                                                </Button>
                                            </div>
                                        </div>
                                    </Row>
                                )
                            })}
                        </Container>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='my-btn'
                    variant="secondary"
                    onClick={() => setModal(false)}
                >
                    Cancel
                </Button>
                <Button
                    className='my-btn'
                    variant="warning"
                    onClick={() => classUrl(name)}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>

    );
};

export default ModalNewCreatorNode;
