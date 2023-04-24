import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalVis: React.FC<{ modalShow: boolean, fnc: Function}> = ({ modalShow, fnc}) => {

    const circleMenuFalse = () => {
        fnc(false)
      }

    return (
        <Modal
            show={modalShow}
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">

                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Centered Modal</h4>
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                    consectetur ac, vestibulum at eros.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={circleMenuFalse}>Close</Button>
            </Modal.Footer>
        </Modal>

    );
};

export default ModalVis;
