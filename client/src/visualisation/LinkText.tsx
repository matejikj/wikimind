import React, { useEffect, useState, useRef } from "react";

const LinkText: React.FC<{ title: string, source: any, target: any, parentContextMenu: Function }> = ({ title, source, target, parentContextMenu }) => {
    const [position, setPosition] = React.useState({
        active: false,
        offset: {}
    });

    const handleContextMenu = (e: any) => {
        const bbox = e.target.getBoundingClientRect();
        const x = source != undefined && target != undefined ? (source[0] + target[0]) / 2 + 40 : 0;
        const y = source != undefined && target != undefined ? (source[1] + target[1]) / 2 + 10: 0;
        e.preventDefault()
        parentContextMenu({x, y});
    };

    useEffect(()=>{
        setPosition({active: position.active, offset: position.offset });
       },[]);

    return (
        <text
            x={source != undefined && target != undefined ? (source[0] + target[0]) / 2 : 0}
            y={source != undefined && target != undefined ? (source[1] + target[1]) / 2 : 0}
            onContextMenu={handleContextMenu}
            fill={position.active ? "blue" : "red"}
        >{title}</text>
    );
};

export default LinkText;
