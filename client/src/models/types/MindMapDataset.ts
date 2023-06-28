import { Connection } from "./Connection";
import { Node } from "./Node";
import { MindMap } from "./MindMap";

export type MindMapDataset = MindMap & {
    links: Connection[];
    nodes: Node[];
}