import { Connection } from "./Connection";
import { Node } from "./Node";
import { MindMap } from "./MindMap";

enum ACCESS_TYPE {
    PUBLIC,
    PRIVATE
}

export type MindMapDataset = MindMap & {
    links: Connection[];
    nodes: Node[];
}