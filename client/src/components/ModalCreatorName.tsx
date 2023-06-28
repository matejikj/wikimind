import { useContext, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { SessionContext } from "../sessionContext";

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalCreatorName: React.FC<{
    showModal: boolean,
    setModal: Function,
    classUrl: Function
}> = ({ showModal, setModal, classUrl }) => {
    const sessionContext = useContext(SessionContext)
    const [name, setName] = useState<string>('');

    const handleClose = () => setModal(false);

    return (
        <Modal
            show={showModal}
            onHide={() => setModal(false)}
        >
            <Modal.Header>
                <Modal.Title>Choose name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label htmlFor="inputKeyword">Name of the new mind map:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='my-btn'
                    variant="secondary"
                    onClick={() => setModal(false)}
                >
                    Close
                </Button>
                <Button
                    className='my-btn'
                    variant="warning"
                    onClick={() => classUrl(name)}
                >
                    Create
                </Button>
            </Modal.Footer>
        </Modal>

        // <Modal
        //     show={showModal}
        // >
        //     <Modal.Body>
        //         {list.map((item, index) => {
        //             return (
        //                 <Row key={index}>
        //                     <div className='aaa'>
        //                         <div className='my-stack'>
        //                             {item.title}
        //                         </div>
        //                         <div className='my-stack-reverse'>
        //                             <Button
        //                                 size='sm'
        //                                 className='class-btn'
        //                                 onClick={() => addMindMap(item)}
        //                                 variant="success"
        //                             >
        //                                 <MdAdd></MdAdd>
        //                             </Button>

        //                         </div>

        //                     </div>
        //                 </Row>
        //             )
        //         })}
        //     </Modal.Body>
        //     <Modal.Footer>
        //         <Button variant="secondary" onClick={handleClose}>
        //             Close
        //         </Button>
        //     </Modal.Footer>
        // </Modal>

    );
};

export default ModalCreatorName;
