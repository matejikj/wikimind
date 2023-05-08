import { ContextMenuItem } from "./ContextMenuItem"

export type ContextMenuType = {
    posX: number,
    posY: number,
    visible: string,
    nodeId: string,
    items: ContextMenuItem[]
 }