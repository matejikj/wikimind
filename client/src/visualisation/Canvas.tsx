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
import { ContextMenuItem } from "../models/types/ContextMenuItem";
import ContextMenu from "./ContextMenu";
import { ContextMenuType } from "../models/types/ContextMenuType";

const DELETE_LINK_METHOD = "delete";
const LINK_RENAME_METHOD = "rename";

const DELETE_NODE_METHOD = "delete";
const DETAIL_METHOD = "detail";
const RECOMMENDS_METHOD = "recommendations";
const CONNECTION_METHOD = "add connection";

const Canvas: React.FC<{ data: MindMapDataset, width: number, height: number, setPosition: Function }> = ({ data, width, height, setPosition }) => {
  const d3Container = useRef(null);
  
  const [modalNewNode, setModalNewNode] = useState(false);
  const [modalNodeDetail, setModalNodeDetail] = useState(false);
  const [modalLinkRename, setModalLinkRename] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalRecommends, setModalRecommends] = useState(false);
  const sessionContext = useContext(SessionContext)

  const addNode = (node: Node) => {
    addNewNode(data.title, sessionContext.userData?.session, node)
    setModalNewNode(false)
  }

  const showNodeDetail = () => {
    setModalNodeDetail(true)
  }

  const addConnection = (node: Node) => {
  }
  
  const showDeleteNode = (node: Node) => {
    addNewNode(data.title, sessionContext.userData?.session, node)
    setModalDelete(false)
  }

  const showRecommends = (node: Node) => {
    addNewNode(data.title, sessionContext.userData?.session, node)
    setModalRecommends(false)
  }

  const showRenameLink = (node: Node) => {
    addNewNode(data.title, sessionContext.userData?.session, node)
    setModalLinkRename(false)
  }

  const showDeleteLink = (node: Node) => {
    addNewNode(data.title, sessionContext.userData?.session, node)
    setModalLinkRename(false)
  }

  const [circleMenu, setCircleMenu] = useState<ContextMenuType>({
    posX: 0,
    posY: 0,
    visible: "hidden",
    nodeId: "",
    items: [
      { title: DETAIL_METHOD, action: showNodeDetail},
      { title: DELETE_NODE_METHOD, action: showDeleteNode},
      { title: RECOMMENDS_METHOD, action: showRecommends},
      { title: CONNECTION_METHOD, action: addConnection}
    ]
  })

  const [linksMenu, setLinksMenu] = useState<ContextMenuType>({
    posX: 0,
    posY: 0,
    visible: "hidden",
    nodeId: "",
    items: [
      { title: DELETE_LINK_METHOD, action: showDeleteLink},
      { title: LINK_RENAME_METHOD, action: showRenameLink}
      ]
  });

  const contextMenuFalse = () => {
    setCircleMenu({
      ...circleMenu,
      visible: "hidden"
    })
    setLinksMenu({
      ...linksMenu,
      visible: "hidden"
    })
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
              <Line key={index} link={link} contextMenu={linksMenu} setContextMenu={setLinksMenu}/>
            );
          })}
          {data.nodes.map((node, index) => {
            return (
              <Circle key={index} node={node} contextMenu={circleMenu} setContextMenu={setCircleMenu} />
            );
          })}
          <ContextMenu
            menu={circleMenu}
          />
          <ContextMenu menu={linksMenu} />
        </svg>
      </Row>
    </Container>
  )
};

export default Canvas;
