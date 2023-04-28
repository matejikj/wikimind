import { Coord } from "../models/types/types"
import { Node } from "../models/types/Node"
import { Link } from "../models/types/Link"

export const getIdsMapping = (list: Array<Node>) => {
    let res = new Map()
    list.map((x) => {
        res.set(x.id, { "x": x.cx, "y": x.cy })
    })
    return res
}

export const AddCoords = (links: Array<Link>, coords: Map<string, Coord>) => {
    links.forEach(item => {
        item.source = [coords.get(item.from)?.x, coords.get(item.from)?.y]
        item.target = [coords.get(item.to)?.x, coords.get(item.to)?.y]
    })
    return links
}