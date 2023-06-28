/**
 * Represents a node or element in a mind map.
 */
export type Node = {
    /**
     * The unique identifier of the node.
     */
    id: string;
    
    /**
     * The title or label of the node.
     */
    title: string;
    
    /**
     * The URI associated with the node.
     */
    uri: string;
    
    /**
     * The description or additional information about the node.
     */
    description: string;
    
    /**
     * The x-coordinate position of the node.
     */
    cx: number;
    
    /**
     * The y-coordinate position of the node.
     */
    cy: number;
    
    /**
     * Indicates whether the node is visible or hidden.
     */
    visible: boolean;
  }
  