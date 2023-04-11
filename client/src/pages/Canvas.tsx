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
      "title": "fdsa",
      "description": "kral ceskych zemi",
      "cx": 423,
      "cy": 87,
      "r": 23,
      "id": "id43",
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
  const [nodes, setNodes] = useState(testData.nodes);

  const aa = () => {
    // 👇️ passing function to setData method
    setNodes([]);
  };

  const fc = () => {
    const newTodos = nodes.map((todo) => {
      if (todo.id === "id3543") {
        return {...todo, cx: todo.cx + 10};
      }
      return todo;
    });
    setNodes(newTodos);
  };
  
  
  useEffect(
    () => {

    }
  )

  const childToParent = () => {
   
  }

  return (
    <div>
      <div onClick={fc}>Klik</div>
      <div onClick={aa}>Klik</div>
      <svg
        className="d3-component"
        width={width}
        height={height}
        ref={d3Container}
      >
        {nodes.map((node, index) => {
          return (
            // <circle cx={node.cx} r={10} cy={node.cy}>{node.cx}</circle>
            <Circle key={index} r={node.r} x={node.cx} y={node.cy} title={node.title} />
          );
        })}      
      </svg>
    </div>
    
  )

};

export default Canvas;
