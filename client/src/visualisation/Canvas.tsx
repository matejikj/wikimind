import React, { useState, useRef, useContext } from "react";
import Circle from "./Circle";
import Line from "./Line";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './Canvas.css';
import Button from 'react-bootstrap/Button';
import { MindMapDataset } from "../models/types/MindMapDataset";
import { SessionContext } from "../sessionContext";
import ModalNodeDetail from "./modals/ModalNodeDetail";
import ModalLinkRename from "./modals/ModalLinkRename";
import ContextMenu from "./ContextMenu";
import { ContextMenuType } from "./models/ContextMenuType";
import { CanvasState } from "./models/CanvasState";
import ModalLinkDelete from "./modals/ModalLinkDelete";
import ModalNodeCreate from "./modals/ModalNodeCreate";
import ModalNodeDelete from "./modals/ModalNodeDelete";
import ModalNodeRecommends from "./modals/ModalNodeRecommends";
import { Link } from "../models/types/Link";
import { Node } from "../models/types/Node";
import { TransformWrapper } from "react-zoom-pan-pinch";
import { TransformComponent } from "react-zoom-pan-pinch";

const DELETE_LINK_METHOD = "delete";
const LINK_RENAME_METHOD = "rename";

const DELETE_NODE_METHOD = "delete";
const DETAIL_METHOD = "detail";
const RECOMMENDS_METHOD = "recommendations";
const CONNECTION_METHOD = "add connection";
const CONNECTION_SELECTION_METHOD = "add connection";

const Canvas: React.FC<{ data: MindMapDataset, width: number, height: number, setPosition: Function }> = ({ data, width, height, setPosition }) => {
  const d3Container = useRef(null);

  const [modalNodeCreate, setModalNodeCreate] = useState(false);
  const [modalNodeDetail, setModalNodeDetail] = useState(false);
  const [modalNodeDelete, setModalNodeDelete] = useState(false);
  const [modalNodeRecommends, setModalNodeRecommends] = useState(false);
  const [modalLinkRename, setModalLinkRename] = useState(false);
  const [modalLinkDelete, setModalLinkDelete] = useState(false);

  const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.DEFAULT);
  const [clickedNode, setClickedNode] = useState<Node>();
  const [clickedLink, setClickedLink] = useState<Link>();

  const [circleMenu, setCircleMenu] = useState<ContextMenuType>({
    posX: 0,
    posY: 0,
    visible: "hidden",
    items: [
      {
        title: DETAIL_METHOD,
        action: () => {
          setModalNodeDetail(true)
        }
      },
      {
        title: DELETE_NODE_METHOD,
        action: () => {
          setModalNodeDelete(true)
        }
      },
      {
        title: RECOMMENDS_METHOD,
        action: () => {
          setModalNodeRecommends(true)
        }
      },
      {
        title: CONNECTION_SELECTION_METHOD,
        action: () => {
          setCanvasState(CanvasState.ADD_CONNECTION)
        }
      }
    ]
  })

  const [linksMenu, setLinksMenu] = useState<ContextMenuType>({
    posX: 0,
    posY: 0,
    visible: "hidden",
    items: [
      {
        title: DELETE_LINK_METHOD,
        action: () => {
          setModalLinkDelete(true)
        }
      },
      {
        title: LINK_RENAME_METHOD,
        action: () => {
          setModalLinkRename(true)
        }
      },
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
    <TransformWrapper
      disabled={true}
    >
      <Button id="float-btn-add" onClick={() => { setModalNodeCreate(true) }} variant="primary">Add</Button>
      <ModalNodeCreate
        datasetName={data.title}
        clickedNode={clickedNode}
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        showModal={modalNodeCreate}
        setModal={setModalNodeCreate}
      />
      <ModalNodeDelete
        datasetName={data.title}
        clickedNode={clickedNode}
        showModal={modalNodeDelete}
        setModal={setModalNodeDelete}
      />
      <ModalNodeRecommends
        datasetName={data.title}
        clickedNode={clickedNode}
        showModal={modalNodeRecommends}
        setModal={setModalNodeRecommends}
      />
      <ModalNodeDetail
        datasetName={data.title}
        clickedNode={clickedNode}
        showModal={modalNodeDetail}
        setModal={setModalNodeDetail}
      />
      <ModalLinkRename
        datasetName={data.title}
        clickedLink={clickedLink}
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        showModal={modalLinkRename}
        setModal={setModalLinkRename}
      />
      <ModalLinkDelete
        datasetName={data.title}
        clickedLink={clickedLink}
        showModal={modalLinkDelete}
        setModal={setModalLinkDelete}
      />
      <TransformComponent

        wrapperStyle={{
          maxWidth: "100%",
          maxHeight: "calc(100vh - 50px)",
        }}
      >
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
              <Line
                key={index}
                link={link}
                contextMenu={linksMenu}
                setContextMenu={setLinksMenu}
              />
            );
          })}
          {data.nodes.map((node, index) => {
            return (
              <Circle
                key={index}
                node={node}
                datasetName={data.title}
                clickedLink={clickedLink}
                setClickedLink={setClickedLink}
                setClickedNode={setClickedNode}
                setModalLinkRename={setModalLinkRename}
                clickedNode={clickedNode}
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                contextMenu={circleMenu}
                setContextMenu={setCircleMenu}
              />
            );
          })}
          <ContextMenu
            menu={circleMenu}
          />
          <ContextMenu
            menu={linksMenu}
          />
        </svg>
      </TransformComponent>
    </TransformWrapper>

  )
};

export default Canvas;
