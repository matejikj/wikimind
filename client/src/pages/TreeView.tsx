import { useContext, useState } from "react";
import { SessionContext } from "../sessionContext";
import { Accordion } from "react-bootstrap";
import { TreeNode } from "../service/creatorUtils";
import '../styles/style.css';
// const ModalVis: React.FC<{ modalShow: boolean, setModalShow: React.Dispatch<React.SetStateAction<boolean>> }> = ({ modalShow, setModalShow }) => {
const TreeView: React.FC<{
    root: TreeNode,
}> = ({ root }) => {
    const sessionContext = useContext(SessionContext)
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>{root.value.label.value}</Accordion.Header>
                <Accordion.Body>
                    {root.children.map((child, index) => (
                        <div key={index}>
                            <TreeView root={child} /> {/* Recursively render child nodes */}
                        </div>
                    ))}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>

        // <div className="list">
        //     <div className="listItem">
        //         <div onClick={handleToggle}>
        //             {isExpanded ? '-' : '+'} {root.value.label.value} {/* Render the value property of the current node */}
        //         </div>
        //         {isExpanded && root.children.length > 0 && (
        //             <div className="collapsible-list">
        //                 {root.children.map((child, index) => (
        //                     <div key={index}>
        //                         <TreeView root={child} /> {/* Recursively render child nodes */}
        //                     </div>
        //                 ))}
        //             </div>
        //         )}
        //     </div>
        // </div>

        // <ul>
        //     <li>
        //         {root.value.label.value} {/* Render the value property of the current node */}
        //         {root.children.length > 0 && (
        //             <ul>
        //                 {root.children.map((child, index) => (
        //                     <li key={index}>
        //                         <TreeView root={child} /> {/* Recursively render child nodes */}
        //                     </li>
        //                 ))}
        //             </ul>
        //         )}
        //     </li>
        // </ul>
    );
};

export default TreeView;
