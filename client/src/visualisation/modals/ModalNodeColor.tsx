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
import { TbColorPicker } from "react-icons/tb";

const blankFormInput = {
    title: '',
    description: ''
}

const ModalNodeColor: React.FC<{
    node: Node | undefined,
    showModal: boolean,
    setModal: Function
}> = ({ node, showModal, setModal }) => {

    const [mounted, setMounted] = useState(false); // <-- new state variable
    const [colors] = useState([
        "#ff9595",
        "#ffc685",
        "#fff491",
        "#a2fca2",
        "#9ffcff",
        "#8cc6ff",
        "#cbbcff",
        "#ff9cff",
        "#fffefc",
        "#a4ffbb",
        "#96e1ff",
        "#ff9dc3",
        "#ffb2b8",
        "#ffd4e3",
        "#fcd3ff",
        "#f8f4f4",
        "#ffe5c3",
        "#fddca2",
        "#c6a6a6",
        "#d2b2c4",
        "#b3c6e8",
        "#8fa5db",
        "#9fdce3",
        "#db9fdb"
    ]); // <-- new state variable
    const [textColors] = useState([
        "black",
        "white",
    ]); // <-- new state variable

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
            <Modal.Header>
                <Modal.Title>Node colors</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col sm="6">
                            Background
                        </Col>
                        <Col sm="6">
                            <button className="colors-div btn" style={{ backgroundColor: node?.color }}>
                                <svg height="1em" width="1em">
                                </svg>
                            </button>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="6">
                            Text
                        </Col>
                        <Col sm="6">
                            <button className="colors-div btn" style={{ backgroundColor: node?.textColor }}>
                                <svg height="1em" width="1em">
                                </svg>
                            </button>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="6">
                            Select background color
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {colors.map((item, index) => {
                                return (
                                    <button className="colors-div btn" style={{ backgroundColor: item }}>
                                        <svg height="1em" width="1em">
                                        </svg>
                                    </button>
                                )
                            })}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="6">
                            Select text color
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {textColors.map((item, index) => {
                                return (
                                    <button className="text-colors-div btn" style={{ backgroundColor: item }}>
                                        <svg height="1em" width="1em">
                                        </svg>
                                    </button>
                                )
                            })}
                        </Col>
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

export default ModalNodeColor;
