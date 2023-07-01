import React, { useContext, useRef, useState } from "react";
import Circle from "./Circle";
import Line from "./Line";
import '../styles/style.css';
import Button from 'react-bootstrap/Button';
import { MindMapDataset } from "../models/types/MindMapDataset";
import { SessionContext } from "../sessionContext";
import { CanvasState } from "./models/CanvasState";
import ModalNodeDelete from "./modals/ModalNodeDelete";
import ModalNodeRecommends from "./modals/ModalNodeRecommends";
import { Connection } from "../models/types/Connection";
import { Node } from "../models/types/Node";
import { TransformWrapper } from "react-zoom-pan-pinch";
import { TransformComponent } from "react-zoom-pan-pinch";
import { updateNode } from "../service/mindMapService";
import { getSingleReccomends } from "../service/dbpediaService";

/**
 * Canvas component for rendering the mind map canvas.
 */
const Canvas: React.FC<{
  clickedNode: Node | undefined,
  setClickedNode: Function,
  data: MindMapDataset | undefined,
  width: number,
  height: number,
  setPosition: Function
}> = ({
  clickedNode,
  setClickedNode,
  data,
  width,
  height,
  setPosition }) => {
    const d3Container = useRef(null);
    const sessionContext = useContext(SessionContext);

    // Modal state hooks
    const [modalNodeCreate, setModalNodeCreate] = useState(false);
    const [modalNodeDetail, setModalNodeDetail] = useState(false);
    const [modalNodeDelete, setModalNodeDelete] = useState(false);
    const [modalNodeRecommends, setModalNodeRecommends] = useState(false);
    const [modalLinkRename, setModalLinkRename] = useState(false);
    const [modalLinkDelete, setModalLinkDelete] = useState(false);
    const [title, setTitle] = useState('ds');

    // Canvas state hooks
    const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.DEFAULT);
    const [clickedLink, setClickedLink] = useState<Connection>();
    const [disabledCanvas, setDisabledCanvas] = useState(false);
    const [recomendsResults, setRecomendsResults] = useState<any[]>([]);

    /**
     * Handles the delete node method.
     * @param node - The node to delete.
     */
    const deleteNodeMethod = (node: Node) => {
      const newLinked = JSON.parse(JSON.stringify(node));
      setClickedNode(newLinked);
      setModalNodeDetail(true);
    }

    /**
     * Retrieves recommendations for the clicked node.
     */
    const recommend = async () => {
      // const name = node.title.replaceAll(' ', '_')
      const results = await getSingleReccomends(clickedNode!.uri);

      setRecomendsResults(results!);
      console.log(results);
      console.log(recomendsResults);

      setModalNodeRecommends(true);
    }

    /**
     * Sets the node visibility for testing purposes.
     * @param node - The node to update visibility.
     */
    const setForTest = (node: Node) => {
      if (node !== undefined) {
        node.visible = false;
        if (data) {
          updateNode(data.id, sessionContext.sessionInfo, node);
        }
      }
    }

    /**
     * Adds a connection for the clicked node.
     * @param node - The node to add a connection to.
     */
    const addConnection = (node: Node) => {
      setCanvasState(CanvasState.ADD_CONNECTION);
    }

    /**
     * Deletes the clicked node.
     * @param node - The node to delete.
     */
    const deleteNode = (node: Node) => {
      setModalNodeDelete(true);
    }

    /**
     * Deletes the connection.
     */
    const deleteConnection = () => {
      setModalLinkDelete(true);
    }

    return (
      <TransformWrapper
        disabled={disabledCanvas}
      >

        <ModalNodeDelete
          datasetName={data}
          clickedNode={clickedNode}
          showModal={modalNodeDelete}
          setModal={setModalNodeDelete}
        />
        <ModalNodeRecommends
          datasetName={data}
          clickedNode={clickedNode}
          recommends={recomendsResults}
          showModal={modalNodeRecommends}
          setModal={setModalNodeRecommends}
        />
        <TransformComponent
          wrapperStyle={{
            maxWidth: "100%",
            maxHeight: "calc(100dvh - 40px)",
          }}
        >
          <svg
            id="svg-canvas"
            onClick={() => setClickedNode(undefined)}
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
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#876" />
              </marker>
            </defs>
            {data && data.links.map((link, index) => {
              return (
                <Line
                  key={index}
                  link={link}
                />
              );
            })}
            {data && data.nodes.map((node, index) => {
              return (
                <Circle
                  key={index}
                  node={node}
                  dataset={data}
                  clickedLink={clickedLink}
                  setClickedLink={setClickedLink}
                  setClickedNode={setClickedNode}
                  setModalLinkRename={setModalLinkRename}
                  clickedNode={clickedNode}
                  canvasState={canvasState}
                  setCanvasState={setCanvasState}
                  setDisabledCanvas={setDisabledCanvas}
                />
              );
            })}
          </svg>
        </TransformComponent>
      </TransformWrapper>
    );
  };

export default Canvas;
