import React, { useEffect, useState, useRef } from "react";
import { IProps } from "../visualisation/types";
import { createGraph } from "../visualisation/Visualisation";
import Sidenav from "../components/Sidenav";

const Circle: React.FC<{ ix: number, iy: number, r: number, title: string }> = ({ix, iy, r, title}) => {
    const [position, setPosition] = React.useState({
        x: ix,
        y: iy,
        active: false,
        offset: {}
    });

    useEffect(()=>{
        setPosition({x: ix, y: iy, active: position.active, offset: position.offset });
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
            setPosition({
                ...position,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                x: position.x - (position.offset.x - x),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                y: position.y - (position.offset.y - y)
            });
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
            cx={position.x}
            cy={position.y}
            r={r}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            fill={position.active ? "blue" : "black"}
        />
    );


    // const [x, setX] = useState(100);
    // const [y, setY] = useState(20);
    // function handleDrag(e: any) {
    //     console.log("X: " + e.clientX + " | Y: " + e.clientY)
    //     console.log("Dragging...")
    // }

    // return (
    //     <circle stroke="#fff" onDrag={handleDrag} strokeWidth="2" cx={x} cy={y} r="30" className="node_id32" fill="rgb(110, 64, 170)"></circle>
    // )
};

export default Circle;
