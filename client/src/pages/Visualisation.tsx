import React, { useEffect, useState, useRef } from "react";
import { IProps } from "../visualisation/types";
import { createGraph } from "../visualisation/Visualisation";
import Sidenav from "../components/Sidenav";
import Canvas from "./Canvas";
import { Node } from "../visualisation/types";

const testData: IProps = {
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

const Visualisation: React.FC = () => {
  const d3Container = useRef(null);

  const ref = useRef(null);
  const [height, setHeight] = useState(500);
  const [width, setWidth] = useState(500);


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const containerRect = (ref.current as any).getBoundingClientRect();
  //     const height = containerRect.height - 10;
  //     const width = containerRect.width - 10;
  //     setHeight(height)
  //     setWidth(width)
  //     console.log(width)
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(
  //   () => {
  //     if (ref.current !== null) {
  //       const containerRect = (ref.current as any).getBoundingClientRect();
  //       const height = containerRect.height;
  //       const width = containerRect.width;
  //       setHeight(containerRect.height)
  //       setWidth(containerRect.width)
  //       console.log(containerRect)

  //     }
  //   }
  // )

  // useEffect(
  //     () => {
  //         if (data && d3Container.current) {
  //             createGraph(d3Container.current, data)
  //         }
  //     }, [data, d3Container.current])

  return (
    <div className="App">
      <Sidenav props={{ message: "Basic" }} />
      <main ref={ref}>
        <Canvas height={height} width={width}></Canvas>
      </main>
    </div>
  )

};

export default Visualisation;
