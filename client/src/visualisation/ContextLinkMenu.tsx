import React from "react";
import { ContextMenuType } from "./models/ContextMenuType";
import { Connection } from "../models/types/Connection";

const ContextCircleMenu: React.FC<{
  menu: ContextMenuType,
  setForTest: Function,
  deleteNode: Function,
  renameNode: Function,
  clickedLink: Connection | undefined,
}> = ({
  menu,
  setForTest,
  deleteNode,
  renameNode,
  clickedLink }) => {

    return (
      <g>
        {/* <rect
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
        </text> */}
      </g>
    );
  };

export default ContextCircleMenu;
