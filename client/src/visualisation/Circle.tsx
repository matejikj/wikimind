import React, { useEffect, useState, useRef, useContext } from "react";
import { SessionContext } from "../sessionContext";

const Circle: React.FC<{ id: string, ix: number, iy: number, title: string, parentSetPosition: Function }> = ({ id, ix, iy, title, parentSetPosition}) => {
    const [position, setPosition] = React.useState({
        active: false,
        offset: {}
    });
    useEffect(()=>{
        setPosition({active: position.active, offset: position.offset });
       },[]);

    const handlePointerDown = (e: any) => {
        const el = e.target;
        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const y = e.clientY - bbox.top;
        el.setPointerCapture(e.pointerId);
        
        setPosition({
            ...position,
            active: true,
            offset: {
                x,
                y
            }
        });
    };
    const handlePointerMove = (e: any) => {
        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const y = e.clientY - bbox.top;
        if (position.active) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            let a = ix - (position.offset.x - x)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            let b = iy - (position.offset.y - y)
            parentSetPosition(a, b, e.target.id)
        }
    };
    const handlePointerUp = (e: any) => {
        setPosition({
            ...position,
            active: false
        });
    };

    return (
        <circle
            cx={ix}
            cy={iy}
            r={25}
            id={id}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            // onTouchStart={handlePointerDown}
            // onTouchEnd={handlePointerUp}
            // onTouchMove={handlePointerMove}
            fill={position.active ? "blue" : "#543"}
        />
    );
};

export default Circle;
