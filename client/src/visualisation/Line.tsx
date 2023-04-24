import React, { useEffect, useState, useRef } from "react";

const Line: React.FC<{ from: string, to: string, source: any, target: any }> = ({ from, to, source, target }) => {
    const [position, setPosition] = React.useState({
        active: false,
        offset: {}
    });

    useEffect(() => {
        setPosition({ active: position.active, offset: position.offset });
    }, []);

    return (
        <line
            x1={source != undefined ? source[0] : 0}
            y1={source != undefined ? source[1] : 0}
            x2={target != undefined ? target[0] : 0}
            y2={target != undefined ? target[1] : 0}
            id={from + "_" + to}
            stroke="#999"
            strokeOpacity="0.6"
            strokeWidth="3"
            markerEnd="url(#triangle)"
        ></line>
    );
};

export default Line;
