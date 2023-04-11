import React, { useEffect, useState, useRef } from "react";
import { IProps } from "../visualisation/types";
import { createGraph } from "../visualisation/Visualisation";
import Sidenav from "../components/Sidenav";
import Circle from "./Circle";

const testData: IProps = {
  "nodes": [
    {
      "title": "Karel IV",
      "description": "kral ceskych zemi",
      "cx": 100,
      "cy": 50,
      "r": 15,
      "id": "id32",
    },
    {
      "title": "dsa",
      "description": "dsa dsa bcv",
      "cx": 200,
      "cy": 100,
      "r": 30,
      "id": "id432",
    },
    {
      "title": "nvbcnbcvnx",
      "description": "nbv aaaaa lkkl",
      "cx": 10,
      "cy": 100,
      "r": 20,
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

const Canvas: React.FC<{ width: number, height: number }> = ({ width, height }) => {
  const d3Container = useRef(null);
  const [data, setData] = useState(testData);

  useEffect(
    () => {

    }
  )

  const childToParent = () => {
   
  }

  return (
    <svg
      className="d3-component"
      width={width}
      height={height}
      ref={d3Container}
    >
      {data.nodes.map((node, index) => {
        return (
          <Circle childToParent={childToParent} r={node.r} x={node.cx} y={node.cy} title={node.title} />
        );
      })}      
    </svg>
  )

};

export default Canvas;
