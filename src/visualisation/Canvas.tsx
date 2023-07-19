import React, { useContext, useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Connection } from "../models/types/Connection";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { Node } from "../models/types/Node";
import { SessionContext } from "../sessionContext";
import '../styles/style.css';
import Line from "./Line";
import Circle from "./MindMapNode";
import { CanvasState } from "./models/CanvasState";

/**
 * Canvas component for rendering the mind map canvas.
 *
 * @param {Object} props - Props for the Canvas component.
 * @param {Connection} props.clickedLink - The clicked connection (link) object.
 * @param {Function} props.setClickedLink - Function to set the clicked connection (link) object.
 * @param {Node} props.clickedNode - The clicked node object.
 * @param {Function} props.setClickedNode - Function to set the clicked node object.
 * @param {MindMapDataset} props.dataset - The mind map dataset containing nodes and links.
 * @param {Function} props.setDataset - Function to set the mind map dataset.
 * @param {number} props.width - The width of the canvas in pixels.
 * @param {number} props.height - The height of the canvas in pixels.
 * @param {Function} props.setPosition - Function to set the canvas position.
 * @param {CanvasState} props.canvasState - The current state of the canvas.
 * @param {Function} props.setCanvasState - Function to set the state of the canvas.
 * @param {boolean} props.disabledCanvas - Flag to determine if the canvas is disabled or not.
 * @param {Function} props.setDisabledCanvas - Function to set the disabledCanvas flag.
 * @param {Function} props.updateCanvasAxis - Function to update the canvas axis.
 * @param {Function} props.setCreatorVisible - Function to set the visibility of the creator.
 * @returns {JSX.Element} - The Canvas component JSX element.
 */
const Canvas: React.FC<{
  clickedLink: Connection | undefined,
  setClickedLink: Function,
  clickedNode: Node | undefined,
  setClickedNode: Function,
  dataset: MindMapDataset | undefined,
  setDataset: Function,
  width: number,
  height: number,
  setPosition: Function,
  canvasState: CanvasState,
  setCanvasState: Function,
  disabledCanvas: boolean,
  setDisabledCanvas: Function,
  updateCanvasAxis: Function,
  setCreatorVisible: Function
}> = ({
  clickedNode,
  setClickedNode,
  dataset,
  width,
  height,
  setPosition,
  setDataset,
  clickedLink,
  setClickedLink,
  canvasState,
  setCanvasState,
  disabledCanvas,
  setDisabledCanvas,
  updateCanvasAxis,
  setCreatorVisible
}) => {
    const [active, setActive] = React.useState<Node | undefined>(undefined);
    const [positionX, setPositionX] = React.useState(0);
    const [positionY, setPositionY] = React.useState(0);
    const [difX, setDifX] = React.useState(0);
    const [difY, setDifY] = React.useState(0);
    
    return (
      <TransformWrapper
        disabled={disabledCanvas}
      >
        <TransformComponent
          wrapperStyle={{
            maxWidth: "100%",
            maxHeight: "calc(100dvh - 40px)",
          }}
        >
          <svg
            id="svg-canvas"
            onClick={() => {
              setClickedNode(undefined)
              setCanvasState(CanvasState.DEFAULT)
            }}
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100%" height="100%" fill="white" />
            <defs>
              <marker
                id="triangle"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerUnits="strokeWidth"
                markerWidth="4"
                markerHeight="9"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#876" />
              </marker>
            </defs>
            {dataset && dataset.links.map((link, index) => {
              return (
                <Line
                  difX={difX}
                  difY={difY}
                  active={active}
                  link={link}
                  key={index}
                  dataset={dataset}
                  setDataset={setDataset}
                />
              );
            })}
            {dataset && dataset.nodes.map((node, index) => {
              return (
                <Circle
                  active={active}
                  positionX={positionX}
                  positionY={positionY}
                  difX={difX}
                  difY={difY}
                  setActive={setActive}
                  setPositionX={setPositionX}
                  setPositionY={setPositionY}
                  setDifX={setDifX}
                  setDifY={setDifY}
                  key={index}
                  setCreatorVisible={setCreatorVisible}
                  node={node}
                  dataset={dataset}
                  setDataset={setDataset}
                  updateCanvasAxis={updateCanvasAxis}
                  setClickedNode={setClickedNode}
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
