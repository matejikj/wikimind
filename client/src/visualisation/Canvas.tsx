import React, { useEffect, useState, useRef } from "react";
import { IProps } from "../types/types";
import Circle from "./Circle";
import Text from "./Text";
import { AddCoords, getIdsMapping } from "../visualisation/utils";
import Line from "./Line";
import LinkText from "./LinkText";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Canvas.css';
import Button from 'react-bootstrap/Button';
import ModalVis from '../components/Modal';

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

const Canvas: React.FC<{ data: IProps, width: number, height: number }> = ({ data, width, height }) => {
  const d3Container = useRef(null);
  const [nodes, setNodes] = useState(data.nodes);
  const [links, setLinks] = useState(AddCoords(data.links, getIdsMapping(data.nodes)));
  const [contextMenu, setContextMenu] = useState({ visibility: "hidden", id: "", x: 100, y: 100 });
  const [circleMenu, setCircleMenu] = useState({ visibility: "hidden", id: "", x: 100, y: 100 });
  const [modalShow, setModalShow] = useState(false);

  const setText = (e: any) => {
    setContextMenu({
      ...contextMenu,
      x: e.x,
      y: e.y,
      visibility: "visible"
    })
    console.log(e)
  }

  const contextMenuFalse = () => {
    setContextMenu({
      ...contextMenu,
      visibility: "hidden"
    })
  }

  const openCircleMenu = (e: any) => {
    setCircleMenu({
      ...contextMenu,
      x: e.x,
      y: e.y,
      visibility: "visible"
    })
    console.log(e)
  }

  const circleMenuFalse = () => {
    setCircleMenu({
      ...contextMenu,

      visibility: "hidden"
    })
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

  const exit = (props: any) => {
    setModalShow(false)
    data.save(5)
    console.log(props)
  }

  return (
    <Container fluid>
      <Button id="float-btn-save" variant="primary">Save</Button>
      <Button id="float-btn-add" onClick={() => {setModalShow(true)}} variant="primary">Add</Button>
      <ModalVis
        modalShow={modalShow}
        fnc={exit}
      />
      <Row>
        <svg
          id="svg-canvas"
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
            {menuItems.map((item, index) => {
              return (
                <rect fill="orange" height={30} width={120} key={index} visibility={contextMenu.visibility} x={contextMenu.x} y={contextMenu.y + index * 30}  ></rect>
              )
            })}
            {menuItems.map((item, index) => {
              return (
                <text key={index} visibility={contextMenu.visibility} x={contextMenu.x} y={contextMenu.y + index * 30 + 20}  >{item.title}</text>
              )
            })}
          </g>
          <g>
            {menuItems.map((item, index) => {
              return (
                <rect fill="orange" height={30} width={120} key={index} visibility={circleMenu.visibility} x={circleMenu.x} y={circleMenu.y + index * 30}  ></rect>
              )
            })}
            {menuItems.map((item, index) => {
              return (
                <text key={index} visibility={circleMenu.visibility} x={circleMenu.x} y={circleMenu.y + index * 30 + 20}  >{item.title}</text>
              )
            })}
          </g>
        </svg>
      </Row>

    </Container>

  )

};

export default Canvas;
