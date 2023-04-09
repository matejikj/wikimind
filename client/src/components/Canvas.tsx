import React, { useEffect, useState, useRef } from "react";
import { IProps } from "../visualisation/types";
import { createGraph } from "../visualisation/Visualisation";

const menuItems = [
    {
      title: 'First action',
      action: (d: any) => {
        // TODO: add any action you want to perform
        console.log(d);
      }
    },
    {
      title: 'Second action',
      action: (d: any) => {
        // TODO: add any action you want to perform
        console.log(d);
      }
    }
  ];

  const Canvas: React.FC<{ props: IProps }> = ({ props }) => {
    const d3Container = useRef(null);

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    
    useEffect(
        () => {
            if (ref.current !== null) {
                const containerRect = (ref.current as any).getBoundingClientRect();
                const height = containerRect.height;
                const width = containerRect.width;
                setHeight(containerRect.height)
                setWidth(containerRect.width)
                console.log(containerRect)
              
              }
        }
    )
      
    useEffect(
        () => {
            if (props && d3Container.current) {
                createGraph(d3Container.current, props)
            }
        }, [props, d3Container.current])

    return (
        <div className="uhiuh" ref={ref}>
            <svg
                className="d3-component"
                width={width}
                height={height}
                ref={d3Container}
            />
        </div>
    )

};

export default Canvas;
