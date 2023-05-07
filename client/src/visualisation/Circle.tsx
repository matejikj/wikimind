import React, { useEffect, useState, useRef, useContext } from "react";
import { SessionContext } from "../sessionContext";
import { Node } from '../models/types/Node'

const Circle: React.FC<{ node: Node, contextMenu: any, setContextMenu: Function }> = ({ node, contextMenu, setContextMenu }) => {
    const [active, setActive] = React.useState(false);
    const [x, setX] = React.useState(node.cx);
    const [y, setY] = React.useState(node.cy);

    const handlePointerDown = (e: any) => {
        const el = e.target;
        const bbox = e.target.getBoundingClientRect();
        // const x = e.clientX - bbox.left;
        // const y = e.clientY - bbox.top;
        el.setPointerCapture(e.pointerId);

        // setX(x)
        // setY(y)
        setActive(true);
    };
    const handlePointerMove = (e: any) => {
        if (active) {
            setX(e.clientX)
            setY(e.clientY - 50)
        }
    };
    const handlePointerUp = (e: any) => {
        // parentSetPosition(x, y, e.target.id)
        setActive(false);
    };

    const handleContextMenu = (e: any) => {
        e.preventDefault()
        // const bbox = e.target.getBoundingClientRect();
        // const x = node != undefined && node.cx : 0;
        // const y = node.source != undefined && node.target != undefined ?
        //     (node.source[1] + node.target[1]) / 2 + 10 : 0;
        setContextMenu({
            ...contextMenu,
            x: x,
            y: y,
            visibility: "visible"
        })
        
    }

    return (
        <g>
            <circle
                cx={x}
                cy={y}
                r={25}
                id={node.id}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
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
                fill={active ? "blue" : "red"}
                onContextMenu={handleContextMenu}
            >{node.title}</text>
        </g>
    );
};

export default Circle;
