import { useContext, useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { SessionContext } from "../sessionContext";
import { getMindMapList } from "../service/containerService";
import { ListItem } from "../models/ListItem";
import { MdAdd } from "react-icons/md";
import { Row } from "react-bootstrap";
import { addGraphToClass } from "../service/classService";

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalClassAddMindMap: React.FC<{
    showModal: boolean,
    setModal: Function,
    classUrl: string
}> = ({ showModal, setModal, classUrl }) => {
    const sessionContext = useContext(SessionContext)
    const [list, setList] = useState<ListItem[]>([]);

    useEffect(() => {
        const result = getMindMapList(sessionContext.sessionInfo).then((res) => {
            setList(res)
        });
    }, []);

    const handleClose = () => setModal(false);

    const addMindMap = (item: ListItem) => {
        addGraphToClass(sessionContext.sessionInfo, item.url, classUrl)
        console.log(item)
    }

    return (
        <Modal
            show={showModal}
        >
            <Modal.Body>
                {list.map((item, index) => {
                    return (
                        <Row key={index}>
                            <div className='aaa'>
                                <div className='my-stack'>
                                    {item.title}
                                </div>
                                <div className='my-stack-reverse'>
                                    <Button
                                        size='sm'
                                        className='class-btn'
                                        onClick={() => addMindMap(item)}
                                        variant="success"
                                    >
                                        <MdAdd></MdAdd>
                                    </Button>

                                </div>

                            </div>
                        </Row>
                    )
                })}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

    );
};

export default ModalClassAddMindMap;
