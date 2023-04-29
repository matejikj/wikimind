import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalVis: React.FC<{ modalShow: boolean, fnc: Function }> = ({ modalShow, fnc }) => {
    const [text, setText] = useState('');

    const circleMenuFalse = () => {
        fnc(false)
    }

    const handleInputChange = async (event: any) => {
        await setText(event.target.value);
        console.log(text)
        try {
            const response = await axios.get('http://localhost:3006');
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleQuery = async (event: any) => {
        await setText(event.target.value);
        console.log(text)
        try {
            const a = "http://localhost:3006/entity?name=" + text
            const response = await axios.get(a);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal
            show={modalShow}
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">

                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form.Label htmlFor="inputKeyword">Searching keyword:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter text"
                    value={text}
                    onChange={handleInputChange}
                />
                <Form.Label htmlFor="inputKeyword">Searching entity:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter text"
                    value={text}
                    onChange={handleQuery}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={circleMenuFalse}>Close</Button>
            </Modal.Footer>
        </Modal>

    );
};

export default ModalVis;
