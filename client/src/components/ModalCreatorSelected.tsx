import { useContext, useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { SessionContext } from "../sessionContext";
import { getMindMapList } from "../service/containerService";
import { ListItem } from "../models/ListItem";
import { TreeNode } from "../service/creatorUtils";
import TreeView from "../pages/TreeView";

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalCreatorSelected: React.FC<{
    selectedItemsVisible: boolean,
    setSelectedItemsVisible: Function,
    setNameVisible: Function,
    roots: TreeNode[],
}> = ({ selectedItemsVisible, setSelectedItemsVisible, setNameVisible, roots }) => {
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
                <TreeView root={roots[0]} /> {/* Recursively render child nodes */}
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
