import React, { useContext } from "react";
import { SessionContext } from "../sessionContext";
import { Node } from '../models/types/Node'
import { CanvasState } from './models/CanvasState'
import { Connection } from "../models/types/Connection";
import { generate_uuidv4 } from "../service/utils";
import { updateNode } from "../service/mindMapService";
import { MindMapDataset } from "../models/types/MindMapDataset";

const Circle: React.FC<{
    node: Node,
    clickedLink: Connection | undefined,
    dataset: MindMapDataset | undefined,
    setClickedLink: Function,
    clickedNode: Node | undefined,
    setClickedNode: Function,
    setModalLinkRename: Function,
    canvasState: CanvasState,
    setCanvasState: Function,
    setDisabledCanvas: Function
}> = ({
    node,
    clickedLink,
    setClickedLink,
    dataset,
    clickedNode,
    setClickedNode,
    setModalLinkRename,
    canvasState,
    setCanvasState,
    setDisabledCanvas
}) => {
        const [active, setActive] = React.useState(false);
        const [moveX, setMoveX] = React.useState(0);
        const [moveY, setMoveY] = React.useState(0);
        const [difX, setDifX] = React.useState(0);
        const [difY, setDifY] = React.useState(0);

        const sessionContext = useContext(SessionContext)

        const handlePointerDown = (e: any) => {
            e.stopPropagation()
            setDisabledCanvas(true)
            if (!(canvasState === CanvasState.ADD_CONNECTION)) {
                if (e.type === "touchstart") {
                    setMoveX(Math.round(e.touches[0].clientX))
                    setMoveY(Math.round(e.touches[0].clientY))
                } else {
                    e.target.setPointerCapture(e.pointerId);
                    setMoveX(Math.round(e.clientX))
                    setMoveY(Math.round(e.clientY))
                }
                setActive(true);
            }
        };
        const handlePointerMove = (e: any) => {
            if (!(canvasState === CanvasState.ADD_CONNECTION)) {
                if (active) {
                    if (e.type === "touchmove") {
                        console.log(Math.round(e.touches[0].clientX - moveX))
                        setDifX(Math.round(e.touches[0].clientX - moveX))
                        setDifY(Math.round(e.touches[0].clientY - moveY))
                    } else {
                        setDifX(Math.round(e.clientX - moveX))
                        setDifY(Math.round(e.clientY - moveY))
                    }    
                    try {
                        e.target.setPointerCapture(e.pointerId);
                    } catch (error) {}
                }
            }
        };
        const handlePointerUp = async (e: any) => {
            setDisabledCanvas(false)
            if (!(canvasState === CanvasState.ADD_CONNECTION)) {
                setActive(false);
                if (difX !== 0 || difY !== 0) {
                    const updatedNode: Node = {
                        visible: true,uri: '',
                        cx: Math.round(node.cx + difX),
                        cy: Math.round(node.cy + difY),
                        title: node.title,
                        id: node.id,
                        description: node.description,
                    }
                    await updateNode(dataset?.id, sessionContext.sessionInfo, updatedNode)
                    setDifX(0)
                    setDifY(0)
                    setMoveX(0)
                    setMoveY(0)
                }

            }
        };

        const nodeOnClick = (e: any) => {
            e.stopPropagation()

            if (canvasState === CanvasState.ADD_CONNECTION) {
                let fromId = ""
                if (clickedNode !== undefined) {
                    fromId = clickedNode.id
                }
                const newLink: Connection = {
                    from: fromId,
                    to: node.id,
                    id: generate_uuidv4(),
                }
                setClickedLink(newLink)
                setCanvasState(CanvasState.DEFAULT)
                setModalLinkRename(true)
            } else {
                setClickedNode(node)
            }
        };

        return (
            <g>
                <rect
                    x={(node.cx + difX) - node.title.length * 4}
                    y={(node.cy + difY) - 10}
                    width={node.title.length * 7 + 20}
                    height={20}
                    fillOpacity={(canvasState === CanvasState.ADD_CONNECTION) ? (clickedNode?.id === node.id ? 0.25 : 0.9) : 0.9}
                    id={node.id}
                    stroke="green"
                    strokeWidth="2"
                    strokeOpacity={0.5}
                    rx="4" ry="4"
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerMove={handlePointerMove}
                    onClick={nodeOnClick}
                    onTouchStart={handlePointerDown}
                    onTouchEnd={handlePointerUp}
                    onTouchMove={handlePointerMove}
                    fill={active ? "white" : "#8FBC8F"}
                />
                <text
                    x={(node.cx + difX) - node.title.length * 4 + 8}
                    y={(node.cy + difY) + 5}
                    id={node.id}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerMove={handlePointerMove}
                    onTouchStart={handlePointerDown}
                    onTouchEnd={handlePointerUp}
                    onTouchMove={handlePointerMove}
                    fill={active ? "#8FBC8F" : "black"}
                    onClick={nodeOnClick}
                >{node.title}{node.visible ? '' : '❓'}</text>
            </g>
        );
    };

export default Circle;
