import React, { useEffect, useState, useRef, useContext } from "react";
import { SessionContext } from "../sessionContext";
import { Node } from '../models/types/Node'
import { CanvasState } from './models/CanvasState'
import { ContextMenuType } from "./models/ContextMenuType";
import { Connection } from "../models/types/Connection";
import { generate_uuidv4 } from "../service/utils";
import { updateNode } from "../service/mindMapService";

const Circle: React.FC<{
    node: Node,
    clickedLink: Connection | undefined,
    datasetName: string,
    setClickedLink: Function,
    clickedNode: Node | undefined,
    setClickedNode: Function,
    setModalLinkRename: Function,
    canvasState: CanvasState,
    setCanvasState: Function,
    contextMenu: ContextMenuType,
    setContextMenu: Function
    setDisabledCanvas: Function
}> = ({
    node,
    clickedLink,
    setClickedLink,
    datasetName,
    clickedNode,
    setClickedNode,
    setModalLinkRename,
    canvasState,
    setCanvasState,
    contextMenu,
    setContextMenu,
    setDisabledCanvas
}) => {
        const [active, setActive] = React.useState(false);
        const [moveX, setMoveX] = React.useState(0);
        const [moveY, setMoveY] = React.useState(0);
        const [difX, setDifX] = React.useState(0);
        const [difY, setDifY] = React.useState(0);

        const theme = useContext(SessionContext)

        const handlePointerDown = (e: any) => {
            e.stopPropagation()
            // e.preventDefault()
            setDisabledCanvas(true)
            if (!(canvasState === CanvasState.ADD_CONNECTION)) {
                if (e.type === "touchstart") {
                    setMoveX(Math.round(e.touches[0].clientX))
                    setMoveY(Math.round(e.touches[0].clientY))
                    // console.log(moveX)
                    // console.log(moveY)

                } else {
                    e.target.setPointerCapture(e.pointerId);
                    setMoveX(Math.round(e.clientX))
                    setMoveY(Math.round(e.clientY))
                }
                try {

                } catch (error) {

                }

                // setX(x)
                // setY(y)
                setActive(true);
            }
        };
        const handlePointerMove = (e: any) => {
            // console.log(e)
            // e.stopPropagation()
            // e.preventDefault()
            if (!(canvasState === CanvasState.ADD_CONNECTION)) {
                if (active) {
                    if (e.type === "touchmove") {
                        console.log(Math.round(e.touches[0].clientX - moveX))
                        setDifX(Math.round(e.touches[0].clientX - moveX))
                        setDifY(Math.round(e.touches[0].clientY - moveY))
                                        console.log("111111111")

                    } else {
                                        console.log("222222222222")

                        setDifX(Math.round(e.clientX - moveX))
                        setDifY(Math.round(e.clientY - moveY))
                    }
                    // console.log(difX)
                    // console.log(difY)
    
                    try {
                        e.target.setPointerCapture(e.pointerId);

                    } catch (error) {

                    }
                    // setX(e.clientX)
                    // setY(e.clientY)
                }
            }
        };
        const handlePointerUp = async (e: any) => {
            setDisabledCanvas(false)
            // e.stopPropagation()
            // e.preventDefault()
            if (!(canvasState === CanvasState.ADD_CONNECTION)) {
                // parentSetPosition(x, y, e.target.id)
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

                    await updateNode(datasetName, theme.sessionInfo.webId, updatedNode)
                    setDifX(0)
                    setDifY(0)
                    setMoveX(0)
                    setMoveY(0)
                }

            }
        };

        const addConnection = (e: any) => {
            if (canvasState === CanvasState.ADD_CONNECTION) {
                // const idMaster = contextMenu.nodeId
                // const idSlave = e.target.id

                // setContextMenu({
                //     ...contextMenu,
                //     node: node
                // })
                console.log(clickedNode)
                console.log(node)
                let fromId = ""
                if (clickedNode !== undefined) {
                    fromId = clickedNode.id
                }
                const newLink: Connection = {
                    from: fromId,
                    to: node.id,
                    title: "",
                    id: generate_uuidv4(),
                    testable: true

                }
                setClickedLink(newLink)
                setCanvasState(CanvasState.DEFAULT)
                setModalLinkRename(true)
                // parentSetPosition(x, y, e.target.id)
            }
        };

        const handleContextMenu = async (e: any) => {
            e.stopPropagation()
            e.preventDefault()

            // const bbox = e.target.getBoundingClientRect();
            // const x = node != undefined && node.cx : 0;
            // const y = node.source != undefined && node.target != undefined ?
            //     (node.source[1] + node.target[1]) / 2 + 10 : 0;
            setClickedNode(node)
            setCanvasState(CanvasState.DEFAULT)
            setContextMenu({
                ...contextMenu,
                posX: node.cx + difX,
                posY: node.cy + difY,
                visible: "visible"
            })
        }

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
                    // stroke={contextMenu.nodeId === node.id ? "green" : "orange"}
                    onContextMenu={handleContextMenu}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerMove={handlePointerMove}
                    // onClick={addConnection}
                    onTouchStart={handlePointerDown}
                    onTouchEnd={handlePointerUp}
                    onTouchMove={handlePointerMove}
                    fill={active ? "white" : "#8FBC8F"}
                />
                <text
                    x={(node.cx + difX) - node.title.length * 4 + 8}
                    y={(node.cy + difY) + 5}
                    id={node.id}
                    onContextMenu={handleContextMenu}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerMove={handlePointerMove}
                    onTouchStart={handlePointerDown}
                    onTouchEnd={handlePointerUp}
                    onTouchMove={handlePointerMove}
                    fill={active ? "#8FBC8F" : "black"}
                    onClick={addConnection}
                >{node.title}{node.visible ? '' : '❓'}</text>
            </g>
        );
    };

export default Circle;
