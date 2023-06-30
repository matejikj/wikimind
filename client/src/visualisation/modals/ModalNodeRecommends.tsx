import { useContext, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Node } from '../../models/types/Node'
import { SessionContext } from "../../sessionContext";
import { MindMapDataset } from "../../models/types/MindMapDataset";

const ModalNodeRecommends: React.FC<{
    datasetName: MindMapDataset | undefined,
    clickedNode: Node | undefined,
    showModal: boolean,
    setModal: Function,
    recommends: any[]
}> = ({ datasetName, clickedNode, recommends, showModal, setModal }) => {
    const theme = useContext(SessionContext)
    const [formInputs, setFormInputs] = useState({
        title: 'title_',
        description: 'description_'
    });

    function handleChange(event: any) {
        const key = event.target.name;
        const value = event.target.value;
        setFormInputs({ ...formInputs, [key]: value })
    }
    function handleSave(event: any) {
        console.log(recommends)
        // const newNode: Node = {
        //     id: generate_uuidv4(),
        //     uri: '',
        //     title: formInputs.title,
        //     description: formInputs.description,
        //     cx: 100,
        //     cy: 100,
        //     visible: true
        // }
        // createNode(datasetName, theme.sessionInfo.webId, newNode)
    }

    return (
        <Modal
            show={showModal}
        >
            <Modal.Body>
                {
                    recommends.map((item) => {
                        return (
                            <p>
                                {item.label.value}
                            </p>
                        )
                    })
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSave}>Add</Button>
                <Button onClick={() => setModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>

    );
};

export default ModalNodeRecommends;
