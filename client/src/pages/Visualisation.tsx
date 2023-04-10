import React, { useEffect, useState, useRef } from "react";
import { IProps } from "../visualisation/types";
import { createGraph } from "../visualisation/Visualisation";
import Sidenav from "../components/Sidenav";
const data = {
  "nodes": [
    {
      "title": "Karel IV",
      "description": "kral ceskych zemi",
      "cx": 100,
      "cy": 50,
      "r": 5,
      "id": "id32",
    },
    {
      "title": "dsa",
      "description": "dsa dsa bcv",
      "cx": 200,
      "cy": 100,
      "r": 8,
      "id": "id432",
    },
    {
      "title": "nvbcnbcvnx",
      "description": "nbv aaaaa lkkl",
      "cx": 10,
      "cy": 100,
      "r": 10,
      "id": "id3543",
    }    
  ],
  "links": [
    {
      "from": "id32",
      "to": "id432",
      "title": "mama"      
    }
  ]
}

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

  const Canvas: React.FC = () => {
    const d3Container = useRef(null);

    const ref = useRef(null);
    const [height, setHeight] = useState(500);
    const [width, setWidth] = useState(500);
    
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
            if (data && d3Container.current) {
                createGraph(d3Container.current, data)
            }
        }, [data, d3Container.current])

    return (
      <div className="App">
        <Sidenav props={{message: "Basic"}} />
        <main>
          <svg
            className="d3-component"
            width={1000}
            height={500}
            ref={d3Container}
          />
        </main>
      </div>
    )

};

export default Canvas;
