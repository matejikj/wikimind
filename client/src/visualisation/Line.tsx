import React, { useEffect, useState, useRef } from "react";
import { Link } from '../models/types/Link'

const Line: React.FC<{ link: Link, contextMenu: any, setContextMenu: Function }> = ({ link, contextMenu, setContextMenu }) => {

    const handleContextMenu = (e: any) => {
        const bbox = e.target.getBoundingClientRect();
        const x = link.source != undefined && link.target != undefined ?
            (link.source[0] + link.target[0]) / 2 + 40 : 0;
        const y = link.source != undefined && link.target != undefined ?
            (link.source[1] + link.target[1]) / 2 + 10 : 0;
        setContextMenu({
            ...contextMenu,
            x: x,
            y: y,
            visibility: "visible"
        })
        e.preventDefault()
        // parentContextMenu({x, y});
    };

    return (
        <g>
            <line
                x1={link.source != undefined ? link.source[0] : 0}
                y1={link.source != undefined ? link.source[1] : 0}
                x2={link.target != undefined ? link.target[0] : 0}
                y2={link.target != undefined ? link.target[1] : 0}
                id={link.from + "_" + link.to}
                stroke="#999"
                strokeOpacity="0.6"
                strokeWidth="3"
                markerEnd="url(#triangle)"
            ></line>
            <text
                x={link.source != undefined && link.target != undefined ?
                    (link.source[0] + link.target[0]) / 2 : 0}
                y={link.source != undefined && link.target != undefined ?
                    (link.source[1] + link.target[1]) / 2 : 0}
                onContextMenu={handleContextMenu}
            >{link.title}</text>
        </g>

    );
};

export default Line;
