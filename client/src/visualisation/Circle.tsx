import React, { useContext } from "react";
import { SessionContext } from "../sessionContext";
import { Node } from '../models/types/Node'
import { CanvasState } from './models/CanvasState'
import { Connection } from "../models/types/Connection";
import { generate_uuidv4 } from "../service/utils";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { ImInfo } from "react-icons/im";

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
    updateCanvasAxis: Function,
    active: Node | undefined,
    positionX: number,
    positionY: number,
    difX: number,
    difY: number,
    setPositionX: Function,
    setPositionY: Function,
    setDifX: Function,
    setActive: Function,
    setDifY: Function,
    setCreatorVisible: Function
}> = ({
    node,
    dataset,
    setDataset,
    clickedNode,
    setClickedNode,
    setCreatorVisible,
    canvasState,
    setCanvasState,
    setDisabledCanvas,
    updateCanvasAxis,
    active,
    positionX,
    positionY,
    difX,
    difY,
    setPositionX,
    setPositionY,
    setDifX,
    setActive,
    setDifY
}) => {

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
                setActive(node);
            }
        };
        const handlePointerMove = (e: any) => {
            if (!(canvasState === CanvasState.ADD_CONNECTION) && active
            ) {
                if (e.type === TOUCH_MOVE) {
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
                setActive(undefined);
                if (difX !== 0 || difY !== 0) {
                    if (dataset) {
                        dataset.links.forEach((connection) => {
                            if (connection.from === node.id) {
                                connection.source = [Math.round(node.cx + difX), Math.round(node.cy + difY)]
                            }
                            if (connection.to === node.id) {
                                connection.target = [Math.round(node.cx + difX), Math.round(node.cy + difY)]
                            }
                        })

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
                        source: [clickedNode.cx, clickedNode.cy],
                        target: [node.cx, node.cy]
                    })
                    setDataset({
                        ...dataset,
                        created: Date.now().toString()
                    });
                    setCanvasState(CanvasState.DEFAULT)
                }
            } else {
                setClickedNode(node)
                setCreatorVisible(true)
            }
        };

        return (
            <g>
                <rect
                    x={(node.id === active?.id ? node.cx + difX : node.cx) - node.title.length * 4}
                    y={(node.id === active?.id ? node.cy + difY : node.cy) - 10}
                    width={node.title.length * 7 + 20}
                    height={20}
                    fillOpacity={(canvasState === CanvasState.ADD_CONNECTION) ? (clickedNode?.id === node.id ? 0.25 : 0.9) : 0.9}
                    id={node.id}
                    strokeWidth={node.id === clickedNode?.id ? 2 : 0.5}
                    stroke={node.id === clickedNode?.id ? "black" : node.color}
                    rx="4" ry="4"
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerMove={handlePointerMove}
                    onClick={nodeOnClick}
                    onTouchStart={handlePointerDown}
                    onTouchEnd={handlePointerUp}
                    onTouchMove={handlePointerMove}
                    fill={active?.id === node.id ? node.textColor : node.color}
                />
                <text
                    x={(node.id === active?.id ? node.cx + difX : node.cx) - node.title.length * 4 + 8}
                    y={(node.id === active?.id ? node.cy + difY : node.cy) + 5}
                    id={node.id}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerMove={handlePointerMove}
                    onTouchStart={handlePointerDown}
                    onTouchEnd={handlePointerUp}
                    onTouchMove={handlePointerMove}
                    fill={active?.id === node.id ? node.color : node.textColor}
                    onClick={nodeOnClick}
                >{node.title}</text>
            </g>
        );
    };

export default Circle;
