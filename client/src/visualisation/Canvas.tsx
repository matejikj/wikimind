import React, { useContext, useEffect, useRef, useState } from "react";
import Circle from "./Circle";
import Line from "./Line";
import '../styles/style.css';
import Button from 'react-bootstrap/Button';
import { MindMapDataset } from "../models/types/MindMapDataset";
import { SessionContext } from "../sessionContext";
import { CanvasState } from "./models/CanvasState";
import { Connection } from "../models/types/Connection";
import { Node } from "../models/types/Node";
import { TransformWrapper } from "react-zoom-pan-pinch";
import { TransformComponent } from "react-zoom-pan-pinch";

/**
 * Canvas component for rendering the mind map canvas.
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
    const d3Container = useRef(null);
    const sessionContext = useContext(SessionContext);

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
            onClick={() => setClickedNode(undefined)}
            width={width}
            height={height}
            ref={d3Container}
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
