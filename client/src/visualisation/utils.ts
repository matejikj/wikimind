import { Node } from "../models/types/Node"
import { Connection } from "../models/types/Connection"

export const getIdsMapping = (list: Array<Node>) => {
    const res = new Map()
    list.map((x) => {
        res.set(x.id, { "x": x.cx, "y": x.cy })
    })
    return res
}

export const AddCoords = (links: Array<Connection>, coords: Map<string, {
    x: number;
    y: number;
}>) => {
    links.forEach(item => {
        item.source = [coords.get(item.from)?.x, coords.get(item.from)?.y]
        item.target = [coords.get(item.to)?.x, coords.get(item.to)?.y]
    })
    return links
}