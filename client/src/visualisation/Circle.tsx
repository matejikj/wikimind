import React, { useEffect, useState, useRef, useContext } from "react";
import { SessionContext } from "../sessionContext";
import { Node } from '../models/types/Node'
import { CanvasState } from './models/CanvasState'
import { ContextMenuType } from "./models/ContextMenuType";
import { Link } from "../models/types/Link";
import { generate_uuidv4 } from "../service/utils";
import { updateNode } from "../service/mindMapService";

const Circle: React.FC<{
    node: Node,
    clickedLink: Link | undefined,
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
    const [x, setX] = React.useState(node.cx);
    const [y, setY] = React.useState(node.cy);

    const theme = useContext(SessionContext)

    const handlePointerDown = (e: any) => {
        // e.stopPropagation()
        // e.preventDefault()
        setDisabledCanvas(true)
        if (!(canvasState === CanvasState.ADD_CONNECTION)) {
            const el = e.target;
            const bbox = e.target.getBoundingClientRect();
            // const x = e.clientX - bbox.left;
            // const y = e.clientY - bbox.top;
            // el.setPointerCapture(e.pointerId);

            // setX(x)
            // setY(y)
            setActive(true);
        }
    };
    const handlePointerMove = (e: any) => {
        console.log(e)
        // e.stopPropagation()
        // e.preventDefault()
        if (!(canvasState === CanvasState.ADD_CONNECTION)) {
            if (active) {
                // setX(e.touches[0].clientX)
                // setY(e.touches[0].clientY)
                setX(e.clientX)
                setY(e.clientY)
            }
        }
    };
    const handlePointerUp = (e: any) => {
        setDisabledCanvas(false)

        // e.stopPropagation()
        // e.preventDefault()
        if (!(canvasState === CanvasState.ADD_CONNECTION)) {
            // parentSetPosition(x, y, e.target.id)
            setActive(false);
            const updatedNode: Node = {
                visible: true,
                cx: x,
                cy: y,
                title: node.title,
                id: node.id,
                description: node.description,
            }
            
            updateNode(datasetName, theme.sessionInfo.webId, updatedNode)
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
            const newLink: Link = {
                from: fromId,
                to: node.id,
                title: "",
                id: generate_uuidv4(),
                visible: true
    
            }
            setClickedLink(newLink)
            setCanvasState(CanvasState.DEFAULT)
            setModalLinkRename(true)
            // parentSetPosition(x, y, e.target.id)
            console.log("KONEKCE")
        }
    };

    const handleContextMenu = (e: any) => {
        e.preventDefault()
        // const bbox = e.target.getBoundingClientRect();
        // const x = node != undefined && node.cx : 0;
        // const y = node.source != undefined && node.target != undefined ?
        //     (node.source[1] + node.target[1]) / 2 + 10 : 0;
        setCanvasState(CanvasState.DEFAULT)
        setClickedNode(node)
        setContextMenu({
            ...contextMenu,
            posX: e.clientX,
            posY: e.clientY - 50,
            visible: "visible"
        })
        console.log("eeeeeeeeeeee")
        console.log(canvasState)
        console.log(clickedNode)
        console.log("eeeeeeeeeeee")


    }

    return (
        <g>
            <circle
                cx={active ? x : node.cx}
                cy={active ? y : node.cy}
                r={25}
                fillOpacity={(canvasState === CanvasState.ADD_CONNECTION) ? (clickedNode?.id === node.id ? 0.25 : 1) : 1}
                id={node.id}
                // stroke={contextMenu.nodeId === node.id ? "green" : "orange"}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                // onClick={addConnection}
                // onTouchStart={handlePointerDown}
                // onTouchEnd={handlePointerUp}
                // onTouchMove={handlePointerMove}
                fill={active ? "blue" : "#543"}
                onContextMenu={handleContextMenu}
            />
            <text
                x={x - node.title.length * 4}
                y={y + 5}
                id={node.id}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                // onTouchStart={handlePointerDown}
                // onTouchEnd={handlePointerUp}
                // onTouchMove={handlePointerMove}

                fill={active ? "blue" : "red"}
                onClick={addConnection}
                onContextMenu={handleContextMenu}
            >{node.title}</text>
        </g>
    );
};

export default Circle;
