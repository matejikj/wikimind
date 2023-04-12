import React, { useEffect, useState, useRef } from "react";
import { IProps } from "../visualisation/types";
import { createGraph } from "../visualisation/Visualisation";
import Sidenav from "../components/Sidenav";
import Circle from "./Circle";
import Text from "./Text";
import { AddCoords, getIdsMapping } from "../visualisation/utils";
import Line from "./Line";
import LinkText from "./LinkText";

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

const Canvas: React.FC<{ width: number, height: number }> = ({ width, height }) => {
  const d3Container = useRef(null);
  const [nodes, setNodes] = useState(testData.nodes);
  const [links, setLinks] = useState(AddCoords(testData.links, getIdsMapping(testData.nodes)));
  const [contextMenu, setContextMenu] = useState({ visibility: "hidden", id: "", x: 100, y: 100 });
  const [circleMenu, setCircleMenu] = useState({ visibility: "hidden", id: "", x: 100, y: 100 });

  const setText = (e: any) => {
    setContextMenu({...contextMenu,
      x: e.x,
      y: e.y,
      visibility: "visible"})
    console.log(e)
  }

  const contextMenuFalse = () => {
    setContextMenu({...contextMenu,
      visibility: "hidden"})
  }

  const openCircleMenu = (e: any) => {
    setCircleMenu({...contextMenu,
      x: e.x,
      y: e.y,
      visibility: "visible"})
    console.log(e)
  }

  const circleMenuFalse = () => {
    setCircleMenu({...contextMenu,
      visibility: "hidden"})
  }

  const setPosition = (x: number, y: number, id: string) => {
    const newTodos = nodes.map((todo) => {
      if (todo.id === id) {
        return { ...todo, cx: x, cy: y };
      }
      return todo;
    });
    setNodes(newTodos);
    const newLinks = links.map((todo) => {
      if (todo.from === id) {
        return { ...todo, source: [x, y] };
      }
      if (todo.to === id) {
        return { ...todo, target: [x, y] };
      }
      return todo;
    });
    setLinks(newLinks);
  }

  return (
    <div>
      <svg
        onClick={contextMenuFalse}
        className="d3-component"
        width={width}
        height={height}
        ref={d3Container}
      >
        <defs>
          <marker
            id="triangle"
            viewBox="0 0 10 10"
            refX="30"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="4"
            markerHeight="9"
            orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#876" />
          </marker>
        </defs>
        {links.map((link, index) => {
          return (
            <Line from={link.from} key={index} to={link.to} source={link.source} target={link.target} />
          );
        })}
        {links.map((link, index) => {
          return (
            <LinkText key={index} title={link.title} source={link.source} parentContextMenu={setText} target={link.target} />
          );
        })}
        {nodes.map((node, index) => {
          return (
            <Circle id={node.id} key={index} ix={node.cx} iy={node.cy} parentSetPosition={setPosition} title={node.title} />
          );
        })}
        {nodes.map((node, index) => {
          return (
            <Text id={node.id} key={index} ix={node.cx} iy={node.cy} parentSetPosition={setPosition} title={node.title} />
          );
        })}
        <g>
          {menuItems.map( (item, index) => {
            return (
              <rect fill="orange" height={30} width={120} key={index} visibility={contextMenu.visibility} x={contextMenu.x} y={contextMenu.y + index * 30}  ></rect>
            )
          })}
          {menuItems.map( (item, index) => {
            return (
              <text key={index} visibility={contextMenu.visibility} x={contextMenu.x} y={contextMenu.y + index * 30 + 20}  >{item.title}</text>
            )
          })}
        </g>
        <g>
          {menuItems.map( (item, index) => {
            return (
              <rect fill="orange" height={30} width={120} key={index} visibility={circleMenu.visibility} x={circleMenu.x} y={circleMenu.y + index * 30}  ></rect>
            )
          })}
          {menuItems.map( (item, index) => {
            return (
              <text key={index} visibility={circleMenu.visibility} x={circleMenu.x} y={circleMenu.y + index * 30 + 20}  >{item.title}</text>
            )
          })}
        </g>
      </svg>
    </div>

  )

};

export default Canvas;
