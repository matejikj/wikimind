import React, { useEffect, useState, useRef } from "react";
import { IProps } from "../types/types";
import Sidenav from "../components/Sidenav";
import Canvas from "../visualisation/Canvas";
import { Node } from "../types/types";

const testData: IProps = {
  "nodes": [
    {
      "title": "Karel IV",
      "description": "kral ceskych zemi",
      "cx": 100,
      "cy": 50,
      "id": "id32",
    },
    {
      "title": "fdsa",
      "description": "kral ceskych zemi",
      "cx": 423,
      "cy": 87,
      "id": "id43",
    },
    {
      "title": "dsa",
      "description": "dsa dsa bcv",
      "cx": 200,
      "cy": 100,
      "id": "id432",
    },
    {
      "title": "nvbcnbcvnx",
      "description": "nbv aaaaa lkkl",
      "cx": 10,
      "cy": 100,
      "id": "id3543",
    }
  ],
  "links": [
    {
      "from": "id32",
      "to": "id432",
      "title": "mama"
    },
    {
      "from": "id32",
      "to": "id43",
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
  const create = (a: number) => {
    console.log("fds")
  }

  return (
    <div className="App">
      <Sidenav props={{ message: "Basic" }} />
      <main ref={ref}>
        <Canvas data={{nodes: testData.nodes, links: testData.links, save: create}} height={height} width={width}></Canvas>
      </main>
    </div>
  )

};

export default Visualisation;
