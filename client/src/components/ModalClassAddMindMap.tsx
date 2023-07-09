import { useContext, useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { SessionContext } from "../sessionContext";
import { ListItem } from "../models/ListItem";
import { MdAdd } from "react-icons/md";
import { Row } from "react-bootstrap";
import { addGraphToClass } from "../service/classService";
import { MindMap } from "../models/types/MindMap";
import { MINDMAPS, SLASH, TTLFILETYPE, WIKIMIND } from "../service/containerService";
import { MindMapService } from "../service/mindMapService";

// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const ModalClassAddMindMap: React.FC<{
    showModal: boolean,
    setModal: Function,
    classUrl: string
}> = ({ showModal, setModal, classUrl }) => {
    const sessionContext = useContext(SessionContext)
    const [mindMapList, setMindMapList] = useState<MindMap[]>([]);

    const mindMapService = new MindMapService();

    async function fetchMindMapList(): Promise<void> {
      try {
        const mindMaps = await mindMapService.getMindMapList(sessionContext.sessionInfo.podUrl);
        mindMaps && setMindMapList(mindMaps)
      } catch (error) {
        // Handle the error, e.g., display an error message to the user or perform fallback actions
      }
    }
  
    useEffect(() => {
        fetchMindMapList()
    }, []);

    const handleClose = () => setModal(false);

    const addMindMap = (item: MindMap) => {
        addGraphToClass(sessionContext.sessionInfo, sessionContext.sessionInfo.podUrl + WIKIMIND + SLASH + MINDMAPS + SLASH + item.id + TTLFILETYPE, classUrl)
        console.log(item)
    }

    return (
        <Modal
            show={showModal}
        >
            <Modal.Body>
                {mindMapList.map((item, index) => {
                    return (
                        <Row key={index}>
                            <div className='aaa'>
                                <div className='my-stack'>
                                    {item.name}
                                </div>
                                <div className='my-stack-reverse'>
                                    <Button
                                        size='sm'
                                        className='rounded-circle'
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
