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
import ContextCircleMenu from "./ContextCircleMenu";
import ContextLinkMenu from "./ContextLinkMenu";
import { ContextMenuType } from "./models/ContextMenuType";
import { CanvasState } from "./models/CanvasState";
import ModalLinkDelete from "./modals/ModalLinkDelete";
import ModalNodeCreate from "./modals/ModalNodeCreate";
import ModalNodeDelete from "./modals/ModalNodeDelete";
import ModalNodeRecommends from "./modals/ModalNodeRecommends";
import { Connection } from "../models/types/Connection";
import { Node } from "../models/types/Node";
import { TransformWrapper } from "react-zoom-pan-pinch";
import { TransformComponent } from "react-zoom-pan-pinch";
import { updateNode } from "../service/mindMapService";
import axios from "axios";
import { getSingleReccomends } from "../service/dbpediaService";

const nodeEx: Node = {
  id: '',
  cx: 0,uri: '',
  cy: 0,
  title: '',
  description: '',
  visible: false
}
const DELETE_LINK_METHOD = "delete";
const LINK_RENAME_METHOD = "rename";

const DELETE_NODE_METHOD = "delete";
const DETAIL_METHOD = "detail";
const RECOMMENDS_METHOD = "recommendations";
const VISIBILITY = "vidibility";
const CONNECTION_METHOD = "add connection";
const CONNECTION_SELECTION_METHOD = "add connection";

const Canvas: React.FC<{ url: string, data: MindMapDataset, width: number, height: number, setPosition: Function }> = ({ url, data, width, height, setPosition }) => {
  const d3Container = useRef(null);
  const theme = useContext(SessionContext)

  const [modalNodeCreate, setModalNodeCreate] = useState(false);
  const [modalNodeDetail, setModalNodeDetail] = useState(false);
  const [modalNodeDelete, setModalNodeDelete] = useState(false);
  const [modalNodeRecommends, setModalNodeRecommends] = useState(false);
  const [modalLinkRename, setModalLinkRename] = useState(false);
  const [modalLinkDelete, setModalLinkDelete] = useState(false);
  const [title, setTitle] = useState('ds');

  const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.DEFAULT);
  const [clickedNode, setClickedNode] = useState<Node>();
  const [clickedLink, setClickedLink] = useState<Connection>();
  const [disabledCanvas, setDisabledCanvas] = useState(false);
  const [recomendsResults, setRecomendsResults] = useState<any[]>([]);

  const deleteNodeMethod = (node: Node) => {
    const newLinked = JSON.parse(JSON.stringify(node))
    setClickedNode(newLinked)
    setModalNodeDetail(true)
  }

  const recommend = async () => {
    let rrr = ''
    // const name = node.title.replaceAll(' ', '_')
    const results = await getSingleReccomends(clickedNode!.uri)

    setRecomendsResults(results!)
    console.log(results)
    console.log(recomendsResults)
    // axios.get("http://localhost:5000/recommends?entity=" + name).then((res) => {
    //   const ress = res.data.map((item: string) => {
    //     rrr = rrr + item.split("http://dbpedia.org/resource/")[1] + '\n'
    //   })
    //   setTitle(ress)
    //   console.log(ress)
    //   console.log(title)
    //   alert(rrr)

    // })

    setModalNodeRecommends(true)
  }
  
  const setForTest = (node: Node) => {
    if (node !== undefined) {
      node.visible = false
      updateNode(data.id, theme.sessionInfo.webId, node)
      console.log(url, theme.sessionInfo.webId, node)
    }
  }

  const addConnection = (node: Node) => {
    setCanvasState(CanvasState.ADD_CONNECTION)
  }

  const deleteNode = (node: Node) => {
    setModalNodeDelete(true)
  }

  const deleteConnection = () => {
    setModalLinkDelete(true)
  }

  const renameConnection = () => {
    setModalLinkRename(true)
  }
  const setForTestConnection = () => {
    setModalLinkRename(true)
  }


  const [circleMenu, setCircleMenu] = useState<ContextMenuType>({
    posX: 0,
    posY: 0,
    visible: "hidden"
  })

  const [linksMenu, setLinksMenu] = useState<ContextMenuType>({
    posX: 0,
    posY: 0,
    visible: "hidden"
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
      disabled={disabledCanvas}
    >
      <Button id="float-btn-add" onClick={() => { setModalNodeCreate(true) }} variant="success">Add</Button>
      <ModalNodeCreate
        datasetName={data.id}
        clickedNode={clickedNode}
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        showModal={modalNodeCreate}
        setModal={setModalNodeCreate}
      />
      <ModalNodeDelete
        datasetName={data.id}
        clickedNode={clickedNode}
        showModal={modalNodeDelete}
        setModal={setModalNodeDelete}
      />
      <ModalNodeRecommends
        datasetName={data.id}
        clickedNode={clickedNode}
        recommends={recomendsResults}
        showModal={modalNodeRecommends}
        setModal={setModalNodeRecommends}
      />
      <ModalNodeDetail
        datasetName={data.id}
        clickedNode={clickedNode}
        showModal={modalNodeDetail}
        setModal={setModalNodeDetail}
      />
      <ModalLinkRename
        datasetName={data.id}
        clickedLink={clickedLink}
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        showModal={modalLinkRename}
        setModal={setModalLinkRename}
      />
      <ModalLinkDelete
        datasetName={data.id}
        clickedLink={clickedLink}
        showModal={modalLinkDelete}
        setModal={setModalLinkDelete}
      />
      <TransformComponent

        wrapperStyle={{
          maxWidth: "100%",
          maxHeight: "calc(100vh - 70px)",
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
              refX="50"
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
                datasetName={data.id}
                clickedLink={clickedLink}
                setClickedLink={setClickedLink}
                setClickedNode={setClickedNode}
                setModalLinkRename={setModalLinkRename}
                clickedNode={clickedNode}
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                contextMenu={circleMenu}
                setContextMenu={setCircleMenu}
                setDisabledCanvas={setDisabledCanvas}
              />
            );
          })}
          <ContextCircleMenu
            clickedNode={clickedNode}
            recommend={recommend}
            deleteNodeMethod={deleteNodeMethod}
            setForTest={setForTest}
            addConnection={addConnection}
            deleteNode={deleteNode}
            menu={circleMenu}
          />
          <ContextLinkMenu
            clickedLink={clickedLink}
            renameNode={renameConnection}
            setForTest={setForTestConnection}
            deleteNode={deleteConnection}
            menu={linksMenu}
          />
        </svg>
      </TransformComponent>
    </TransformWrapper>

  )
};

export default Canvas;
