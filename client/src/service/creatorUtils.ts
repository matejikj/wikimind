import * as d3 from "d3";
import { ResultItem } from "../models/ResultItem";
import { Connection } from "../models/types/Connection";
import { Node } from "../models/types/Node";
import { generate_uuidv4 } from "./utils";
import { SessionContext } from "../sessionContext";
import { UserSession } from "../models/types/UserSession";
import { createPreparedMindMap } from "./mindMapService";

/**
 * Represents a node in the mind map tree.
 */
export type TreeNode = {
  value: ResultItem;
  parent: TreeNode | undefined;
  children: TreeNode[];
  id?: string;
};

/**
 * Checks if a link is present in an array of links.
 * @param links - Array of links to check.
 * @param source - Source node of the link.
 * @param target - Target node of the link.
 * @param type - Type of the link.
 * @returns A boolean indicating whether the link is present.
 */
function isInLinks(links: any, source: string, target: string, type: string): boolean {
  let result = false;
  links.forEach((link: any) => {
    if (link.source === source && link.target === target && link.type === type) {
      result = true;
    }
  });
  return result;
}

/**
 * Adds a link between nodes in the mind map tree structure.
 * @param addedItem - Node to be added.
 * @param connectionNode - Node to which the link should be established.
 * @param node - Parent node to which the link and addedItem should be attached.
 */
export async function addLink(addedItem: ResultItem, connectionNode: ResultItem, node: TreeNode) {
  if (connectionNode === undefined) {
    const isAddedInNode = node.children.find(
      (item) =>
        item.value.entity.value === addedItem.entity.value &&
        item.value.label.value === addedItem.label.value
    );
    if (isAddedInNode === undefined) {
      const newNode: TreeNode = {
        value: addedItem,
        parent: node,
        children: []
      };
      node.children.push(newNode);
    }
  } else {
    const isConnectionInNodes = node.children.find(
      (item) =>
        item.value.entity.value === connectionNode.entity.value &&
        item.value.label.value === connectionNode.label.value
    );
    if (isConnectionInNodes === undefined) {
      const newNode: TreeNode = {
        value: connectionNode,
        parent: node,
        children: []
      };
      node.children.push(newNode);
      const newChild: TreeNode = {
        value: addedItem,
        parent: newNode,
        children: []
      };
      newNode.children.push(newChild);
    } else {
      const newChild: TreeNode = {
        value: addedItem,
        parent: isConnectionInNodes,
        children: []
      };
      isConnectionInNodes.children.push(newChild);
    }
  }
}

/**
 * Performs a breadth-first search traversal of the mind map tree structure and generates a mind map visualization.
 * @param root - Root node of the mind map tree.
 * @param name - Name of the mind map.
 * @param sessionContext - User session context.
 */
export function bfs(root: TreeNode, name: string, sessionContext: UserSession): void {
  const nodes: Node[] = [];
  const links: Connection[] = [];

  const visNodes: any[] = [];
  const visLinks: any[] = [];

  const idQueue: TreeNode[] = [root];

  while (idQueue.length > 0) {
    const current = idQueue.shift();
    if (current) {
      if (current.id === undefined) {
        current.id = generate_uuidv4();
      }
      visNodes.push(current);
      // Enqueue the children of the current node
      current.children.forEach((child) => {
        if (child.id === undefined) {
          child.id = generate_uuidv4();
        }
        visLinks.push({
          source: current.id,
          target: child.id
        });
        idQueue.push(child);
      });
    }
  }

  const simulation = d3
    .forceSimulation(visNodes)
    // @ts-ignore
    .force("link", d3.forceLink(visLinks).id((d: any) => d.id))
    .force("center", d3.forceCenter(1000 / 2, 1000 / 2))
    .force("collide", d3.forceCollide())
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .stop()
    .tick(100);

  visNodes.forEach((item: any) => {
    nodes.push({
      id: item.id,
      title: item.value.label.value,
      uri: item.value.entity.value,
      description: "",
      cx: item.x,
      cy: item.y,
      visible: true
    });
  });

  visLinks.forEach((item: any) => {
    links.push({
      id: generate_uuidv4(),
      title: "",
      from: item.source.id,
      to: item.target.id,
      testable: true
    });
  });

  createPreparedMindMap(nodes, links, name, sessionContext);

  console.log("fadss");
}
