import { Link } from "./Link";
import { Node } from "./Node";
import { MindMap } from "./MindMap";

enum ACCESS_TYPE {
    PUBLIC,
    PRIVATE
}

export type MindMapDataset = MindMap & {
    links: Link[];
    nodes: Node[];
}