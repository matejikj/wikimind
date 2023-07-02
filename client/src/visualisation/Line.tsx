import React from "react";
import { Connection } from '../models/types/Connection'
import { Node } from '../models/types/Node'

const Line: React.FC<{
    link: Connection,
    active: Node | undefined,
    difX: number,
    difY: number
}> = ({ link,
    active,
    difX,
    difY
}) => {

    function aaa() {
        console.log(link)
    }
        return (
            <g>
                <line
                    x1={link.source !== undefined ? (active?.id === link.from ? link.source[0] + difX : link.source[0])  : 0}
                    y1={link.source !== undefined ? (active?.id === link.from ? link.source[1] + difY : link.source[1])  : 0}
                    x2={link.target !== undefined && link.source !== undefined ? (  (active?.id === link.to ? link.target[0] + difX : link.target[0]) + (active?.id === link.from ? link.source[0] + difX : link.source[0])) / 2 : 0}
                    y2={link.target !== undefined && link.source !== undefined ? ((active?.id === link.to ? link.target[1] + difY : link.target[1]) + (active?.id === link.from ? link.source[1] + difY : link.source[1])) / 2 : 0}
                    id={link.from + "_" + link.to}
                    stroke="#999"
                    strokeOpacity="0.6"
                    strokeWidth="2"
                    markerEnd="url(#triangle)"
                ></line>
                <line
                    x1={link.target !== undefined && link.source !== undefined ? ((active?.id === link.to ? link.target[0] + difX : link.target[0]) + (active?.id === link.from ? link.source[0] + difX : link.source[0])) / 2 : 0}
                    y1={link.target !== undefined && link.source !== undefined ? ((active?.id === link.to ? link.target[1] + difY : link.target[1]) + (active?.id === link.from ? link.source[1] + difY : link.source[1])) / 2 : 0}
                    x2={link.source !== undefined ? (active?.id === link.to ? link.target[0] + difX : link.target[0])  : 0}
                    y2={link.source !== undefined ? (active?.id === link.to ? link.target[1] + difY : link.target[1])  : 0}
                    id={link.from + "_" + link.to}
                    stroke="#999"
                    strokeOpacity="0.6"
                    strokeWidth="2"
                ></line>


                <line
                    x1={link.source !== undefined ? link.source[0] : 0}
                    y1={link.source !== undefined ? link.source[1] : 0}
                    x2={link.target !== undefined && link.source !== undefined ? (link.target[0] + link.source[0]) / 2 : 0}
                    y2={link.target !== undefined && link.source !== undefined ? (link.target[1] + link.source[1]) / 2 : 0}
                    id={link.from + "_" + link.to}
                    stroke="#999"
                    strokeOpacity="0"
                    strokeWidth="10"
                    onClick={() => alert()}
                ></line>
                <line
                    x1={link.target !== undefined && link.source !== undefined ? (link.target[0] + link.source[0]) / 2 : 0}
                    y1={link.target !== undefined && link.source !== undefined ? (link.target[1] + link.source[1]) / 2 : 0}
                    x2={link.target !== undefined ? link.target[0] : 0}
                    y2={link.target !== undefined ? link.target[1] : 0}
                    id={link.from + "_" + link.to}
                    stroke="#999"
                    strokeOpacity="0"
                    strokeWidth="10"
                    onClick={() => alert()}
                ></line>
            </g>
        );
    };

export default Line;
