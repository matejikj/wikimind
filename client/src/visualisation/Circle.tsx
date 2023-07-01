import React, { useContext } from "react";
import { SessionContext } from "../sessionContext";
import { Node } from '../models/types/Node'
import { CanvasState } from './models/CanvasState'
import { Connection } from "../models/types/Connection";
import { generate_uuidv4 } from "../service/utils";
import { updateNode } from "../service/mindMapService";
import { MindMapDataset } from "../models/types/MindMapDataset";

const TOUCH_MOVE = 'touchmove'
const TOUCH_START = 'touchstart'

const Circle: React.FC<{
    node: Node,
    dataset: MindMapDataset | undefined,
    setDataset: Function,
    clickedNode: Node | undefined,
    setClickedNode: Function,
    canvasState: CanvasState,
    setCanvasState: Function,
    setDisabledCanvas: Function,
    updateCanvasAxis: Function
}> = ({
    node,
    dataset,
    setDataset,
    clickedNode,
    setClickedNode,
    canvasState,
    setCanvasState,
    setDisabledCanvas,
    updateCanvasAxis
}) => {
        const [active, setActive] = React.useState(false);
        const [positionX, setPositionX] = React.useState(0);
        const [positionY, setPositionY] = React.useState(0);
        const [difX, setDifX] = React.useState(0);
        const [difY, setDifY] = React.useState(0);

        const handlePointerDown = (e: any) => {
            e.stopPropagation()
            setDisabledCanvas(true)
            if (!(canvasState === CanvasState.ADD_CONNECTION)) {
                if (e.type === TOUCH_START) {
                    setPositionX(Math.round(e.touches[0].clientX))
                    setPositionY(Math.round(e.touches[0].clientY))
                } else {
                    e.target.setPointerCapture(e.pointerId);
                    setPositionX(Math.round(e.clientX))
                    setPositionY(Math.round(e.clientY))
                }
                setActive(true);
            }
        };
        const handlePointerMove = (e: any) => {
            if (!(canvasState === CanvasState.ADD_CONNECTION) && active
            ) {
                if (e.type === TOUCH_MOVE) {
                    console.log(Math.round(e.touches[0].clientX - positionX))
                    setDifX(Math.round(e.touches[0].clientX - positionX))
                    setDifY(Math.round(e.touches[0].clientY - positionY))
                } else {
                    setDifX(Math.round(e.clientX - positionX))
                    setDifY(Math.round(e.clientY - positionY))
                }
                try {
                    e.target.setPointerCapture(e.pointerId);
                } catch (error) { }
            }
        };
        const handlePointerUp = async (e: any) => {
            setDisabledCanvas(false)
            if (!(canvasState === CanvasState.ADD_CONNECTION)) {
                setActive(false);
                if (difX !== 0 || difY !== 0) {
                    if (dataset) {
                        node.cx = Math.round(node.cx + difX)
                        node.cy = Math.round(node.cy + difY)
                        updateCanvasAxis(dataset)
                        setDataset({
                            ...dataset,
                            created: '1.7.2023 21:08:08'
                        });
                    }
                    setDifX(0)
                    setDifY(0)
                    setPositionX(0)
                    setPositionY(0)
                }
            }
        };

        const nodeOnClick = (e: any) => {
            e.stopPropagation()

            if (canvasState === CanvasState.ADD_CONNECTION) {
                if (clickedNode && dataset) {
                    dataset.links.push({
                        from: clickedNode.id,
                        to: node.id,
                        id: generate_uuidv4(),
                    })
                    setDataset({
                        ...dataset,
                        created: '1.7.2023 21:08:08'
                    });
                    setCanvasState(CanvasState.DEFAULT)
                }
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
                    stroke="black"
                    strokeWidth="0.5"
                    strokeOpacity={1}
                    rx="4" ry="4"
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerMove={handlePointerMove}
                    onClick={nodeOnClick}
                    onTouchStart={handlePointerDown}
                    onTouchEnd={handlePointerUp}
                    onTouchMove={handlePointerMove}
                    fill={active ? "white" : node.color}
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
                    fill={active ? node.color : "white"}
                    onClick={nodeOnClick}
                >{node.title}{node.visible ? '' : '❓'}</text>
            </g>
        );
    };

export default Circle;
