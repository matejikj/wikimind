import { useContext, useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { SessionContext } from "../sessionContext";
import { getMindMapList } from "../service/containerService";
import { ListItem } from "../models/ListItem";
import { MdAdd, MdDeleteForever, MdDriveFileRenameOutline, MdPlusOne, MdSlideshow } from "react-icons/md";
import { Row } from "react-bootstrap";
import { addGraphToClass } from "../service/classService";

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalCreatorSelected: React.FC<{
    selectedItemsVisible: boolean,
    setSelectedItemsVisible: Function,
    setNameVisible: Function,
    nodes: any[],
}> = ({ selectedItemsVisible, setSelectedItemsVisible, setNameVisible, nodes }) => {
    const sessionContext = useContext(SessionContext)
    const [list, setList] = useState<ListItem[]>([]);

    useEffect(() => {
        const result = getMindMapList(sessionContext.sessionInfo).then((res) => {
            setList(res)
        });
    }, []);

    return (
        <Modal
            show={selectedItemsVisible}
            onHide={() => setSelectedItemsVisible(false)}
        >
            <Modal.Header>
                <Modal.Title>Choose name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="">
                    {nodes.map((item, index) => {
                        return (
                            <button key={index} className="creator-btn">
                                {item.label.value}
                                {/* <button className="creator-delete-btn" onClick={(e) => { e.stopPropagation(); alert('minus') }}>
                                <FaMinus></FaMinus>
                            </button> */}
                            </button>
                        )
                    })}
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='my-btn'
                    variant="secondary"
                    onClick={() => setSelectedItemsVisible(false)}
                >
                    Close
                </Button>
                <Button
                    className='my-btn'
                    variant="warning"
                    onClick={() => { setSelectedItemsVisible(false); setNameVisible(true) }}
                >
                    Done
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalCreatorSelected;
