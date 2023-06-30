import React from "react";
import { Connection } from '../models/types/Connection'

const Line: React.FC<{ link: Connection, contextMenu: any, setContextMenu: Function }> = ({ link, contextMenu, setContextMenu }) => {

    const handleContextMenu = (e: any) => {
        const bbox = e.target.getBoundingClientRect();
        const x = link.source !== undefined && link.target !== undefined ?
            (link.source[0] + link.target[0]) / 2 + 40 : 0;
        const y = link.source !== undefined && link.target !== undefined ?
            (link.source[1] + link.target[1]) / 2 + 10 : 0;
        setContextMenu({
            ...contextMenu,
            x: x,
            y: y,
            visibility: "visible",
            nodeId: link.id
        })
        e.preventDefault()
        // parentContextMenu({x, y});
    };

    return (
        <g>
            <line
                x1={link.source !== undefined ? link.source[0] : 0}
                y1={link.source !== undefined ? link.source[1] : 0}
                x2={link.target !== undefined ? link.target[0] : 0}
                y2={link.target !== undefined ? link.target[1] : 0}
                id={link.from + "_" + link.to}
                stroke="#999"
                strokeOpacity="0.6"
                strokeWidth="1.5"
                markerEnd="url(#triangle)"
            ></line>
        </g>

    );
};

export default Line;
