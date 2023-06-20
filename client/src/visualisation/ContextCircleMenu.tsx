import React, { useEffect, useState, useRef, useContext } from "react";
import { SessionContext } from "../sessionContext";
import { Node } from '../models/types/Node'
import { ContextMenuType } from "./models/ContextMenuType";

const ContextCircleMenu: React.FC<{
  menu: ContextMenuType,
  recommend: Function,
  deleteNodeMethod: Function,
  setForTest: Function,
  addConnection: Function,
  deleteNode: Function,
  clickedNode: Node | undefined,
}> = ({
  menu,
  recommend,
  deleteNodeMethod,
  setForTest,
  addConnection,
  deleteNode,
  clickedNode }) => {

    return (
      <g>
        <rect
          stroke="green"
          strokeWidth="3"
          rx="4" ry="4"
          fill="white"
          onClick={() => recommend()}
          height={30}
          width={165}
          visibility={menu.visible}
          x={menu.posX}
          y={menu.posY + 0 * 30}
        >

        </rect>
        <text onClick={() => recommend()}
          visibility={menu.visible}
          x={menu.posX + 5}
          y={menu.posY + 0 * 30 + 20}
        >
          recommend
        </text>
      </g>
    );
  };

export default ContextCircleMenu;
