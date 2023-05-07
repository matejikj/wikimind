import React, { useEffect, useState, useRef, useContext } from "react";
import { IProps } from "../models/types/types";
import Circle from "./Circle";
import { AddCoords, getIdsMapping } from "../visualisation/utils";
import Line from "./Line";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Canvas.css';
import Button from 'react-bootstrap/Button';
import { Node } from "../models/types/Node";
import { createNode } from "../service/nodeService";
import { MindMap } from "../models/types/MindMap";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { SessionContext } from "../sessionContext";
import { addNewNode } from "../service/mindMapService";
import { theme } from "rdf-namespaces/dist/foaf";
import ModalNewNode from "./modals/ModalNewNode";
import ModalDelete from "./modals/ModalDelete";
import ModalRecommends from "./modals/ModalRecommends";
import ModalNodeDetail from "./modals/ModalNodeDetail";
import ModalLinkRename from "./modals/ModalLinkRename";

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

const Canvas: React.FC<{ data: MindMapDataset, width: number, height: number, setPosition: Function }> = ({ data, width, height, setPosition }) => {
  const d3Container = useRef(null);
  const [linksMenu, setLinksMenu] = useState({ visibility: "hidden", id: "", x: 100, y: 100 });
  const [circleMenu, setCircleMenu] = useState({ visibility: "hidden", id: "", x: 100, y: 100 });
  const [modalNewNode, setModalNewNode] = useState(false);
  const [modalNodeDetail, setModalNodeDetail] = useState(false);
  const [modalLinkRename, setModalLinkRename] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalRecommends, setModalRecommends] = useState(false);
  const sessionContext = useContext(SessionContext)

  const contextMenuFalse = () => {
    setCircleMenu({
      ...circleMenu,
      visibility: "hidden"
    })
    setLinksMenu({
      ...linksMenu,
      visibility: "hidden"
    })
  }

  const addNode = (node: Node) => {
    addNewNode(data.title, sessionContext.userData?.session, node)
    setModalNewNode(false)
  }

  const nodeDetail = (node: Node) => {
    addNewNode(data.title, sessionContext.userData?.session, node)
    setModalNewNode(false)
  }

  const addConnection = (node: Node) => {
  }
  
  const deleteNode = (node: Node) => {
    addNewNode(data.title, sessionContext.userData?.session, node)
    setModalDelete(false)
  }

  const recommends = (node: Node) => {
    addNewNode(data.title, sessionContext.userData?.session, node)
    setModalRecommends(false)
  }

  const renameLink = (node: Node) => {
    addNewNode(data.title, sessionContext.userData?.session, node)
    setModalLinkRename(false)
  }

  return (
    <Container fluid>
      <Button id="float-btn-add" onClick={() => { setModalNewNode(true) }} variant="primary">Add</Button>
      <ModalNewNode
        modalShow={modalNewNode}
        fnc={addNode}
      />
      <ModalDelete
        modalShow={modalDelete}
        fnc={addNode}
      />
      <ModalRecommends
        modalShow={modalRecommends}
        fnc={addNode}
      />
      <ModalNodeDetail
        modalShow={modalNodeDetail}
        fnc={addNode}
      />
      <ModalLinkRename
        modalShow={modalLinkRename}
        fnc={addNode}
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
          {data.links.map((link, index) => {
            return (
              <Line key={index} link={link} contextMenu={circleMenu} setContextMenu={setPosition}/>
            );
          })}
          {data.nodes.map((node, index) => {
            return (
              <Circle key={index} node={node} contextMenu={circleMenu} setContextMenu={setCircleMenu} />
            );
          })}
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
