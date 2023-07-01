import React, { useContext, useRef, useState } from "react";
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
  updateCanvasAxis: Function
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
  updateCanvasAxis
}) => {
    const d3Container = useRef(null);
    const sessionContext = useContext(SessionContext);

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
            {dataset && dataset.links.map((link, index) => {
              return (
                <Line
                  key={index}
                  link={link}
                />
              );
            })}
            {dataset && dataset.nodes.map((node, index) => {
              return (
                <Circle
                  key={index}
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
