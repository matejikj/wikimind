import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { Node } from "../../models/types/Node";
import '../../styles/style.css';

const blankFormInput = {
    title: '',
    description: ''
}

const ModalNodeColor: React.FC<{
    node: Node | undefined,
    showModal: boolean,
    setModal: Function
}> = ({ node, showModal, setModal }) => {

    const [colors] = useState([
        "#ff5733",
        "#a8329e",
        "#4f9a3d",
        "#176ac2",
        "#f0c724",
        "#8257f1",
        "#e82a6d",
        "#39bca7",
        "#c43e13",
        "#6f98d0",
        "#db6f1a",
        "#3bc939",
        "#c41b80",
        "#578f2d",
        "#f033a6",
        "#2c7f8c",
        "#eb5d15",
        "#3e4694",
        "#a1c514",
        "#8d2596",
        "#1eb8d7",
        "#d35523",
        "#5e2e8a",
        "#b6a816"
    ]); // <-- new state variable
    const [textColors] = useState([
        "black",
        "white",
    ]); // <-- new state variable

    const [color, setColor] = useState(node?.color);
    const [textColor, setTextColor] = useState(node?.textColor);

    function changeColor(color: string) {
        if (node) {
            node.color = color
            setColor(color)
        }
    }

    function changeTextColor(color: string) {
        if (node) {
            node.textColor = color
            setTextColor(color)
        }
    }

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
                                    <button key={index} data-testid={`colors-div-button-${index}`} // Add this line
                                        onClick={() => changeColor(item)} className="colors-div btn" style={{ backgroundColor: item }}>
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
                                    <button key={index} onClick={() => changeTextColor(item)} className="text-colors-div btn" style={{ backgroundColor: item }}>
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
