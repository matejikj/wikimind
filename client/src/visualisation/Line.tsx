import React from "react";
import { Connection } from '../models/types/Connection'

const Line: React.FC<{
    link: Connection
}> = ({ link }) => {

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
