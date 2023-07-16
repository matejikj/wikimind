import { Connection } from "./Connection";
import { Node } from "./Node";
import { MindMap } from "./MindMap";

/**
 * Represents a mind map dataset that includes information about a mind map and its associated links and nodes.
 */
export type MindMapDataset = {
  /**
   * The mind map object containing information about the mind map itself.
   */
  mindMap: MindMap;

  /**
   * An array of connections or links within the mind map.
   */
  links: Connection[];

  /**
   * An array of nodes or elements in the mind map.
   */
  nodes: Node[];
}
