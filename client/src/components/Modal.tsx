import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { createNode } from "../service/mindMap";
import { Node } from '../models/types/Node'

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalVis: React.FC<{ modalShow: boolean, fnc: Function }> = ({ modalShow, fnc }) => {
    const [formInputs, setFormInputs] = useState({
        title: 'title_',
        id: 'id_',
        description: 'description_'
    });

    // const [contextMenu, setContextMenu] = useState({ x: 100, y: 100 });
    // setContextMenu({
    //     ...contextMenu,
    //     visibility: "visible"
    // })

    const circleMenuFalse = () => {
        fnc(false)
    }

    function handleChange(event: any) {
        const key = event.target.name;
        const value = event.target.value;
        setFormInputs({...formInputs, [key]: value})
    }

    const handleInputChange = async (event: any) => {
        fnc(formInputs)
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
                    placeholder="Id"
                    value={formInputs.id}
                    name="id"
                    onChange={handleChange}
                />
                <Form.Control
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={formInputs.title}
                    onChange={handleChange}
                />
                <Form.Control
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formInputs.description}
                    onChange={handleChange}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleInputChange}>Add</Button>
            </Modal.Footer>
        </Modal>

    );
};

export default ModalVis;
