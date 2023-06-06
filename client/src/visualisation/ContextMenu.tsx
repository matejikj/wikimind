import React, { useEffect, useState, useRef, useContext } from "react";
import { SessionContext } from "../sessionContext";
import { Node } from '../models/types/Node'
import { ContextMenuType } from "./models/ContextMenuType";

const ContextMenu: React.FC<{
  menu: ContextMenuType, clickedNode: Node | undefined,
}> = ({ menu, clickedNode }) => {

  const handleContextMenu = (e: any) => {
    console.log(clickedNode)
    menu.items[parseInt(e.target.id)].action(clickedNode)
  }

  return (
    <g>
      {menu.items.map((item, index) => {
        return (
          <rect
            stroke="green"
            strokeWidth="3"
            rx="4" ry="4"
            fill="white" onClick={handleContextMenu} height={30} id={index.toString()} width={165} key={index} visibility={menu.visible} x={menu.posX} y={menu.posY + index * 30}  ></rect>
        )
      })}
      {menu.items.map((item, index) => {
        return (
          <text key={index} id={index.toString()} onClick={handleContextMenu} visibility={menu.visible} x={menu.posX + 5} y={menu.posY + index * 30 + 20}  >{item.title}</text>
        )
      })}
    </g>
  );
};

export default ContextMenu;
