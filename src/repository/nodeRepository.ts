import {
    getSolidDataset,
    getThingAll,
    getUrlAll,
    createSolidDataset,
    setThing,
    saveSolidDatasetAt
  } from "@inrupt/solid-client";
  import { fetch } from "@inrupt/solid-client-authn-browser";
  import { RDF } from "@inrupt/vocab-common-rdf";
  import nodeDefinition from "../definitions/node.json";
  import { NodeLDO } from "../models/things/NodeLDO";
  import { Node } from "../models/types/Node";
  
  /**
   * Represents a repository for managing node data using Solid data storage.
   */
  export class NodeRepository {
    private nodeLDO: NodeLDO;
  
    /**
     * Creates a new instance of the NodeRepository class.
     */
    constructor() {
      this.nodeLDO = new NodeLDO(nodeDefinition);
    }
  
    /**
     * Retrieves all nodes from Solid data storage under the given storage URL.
     * @param storageUrl - The URL of the storage where the nodes are located.
     * @returns A Promise that resolves to an array of Node objects found in the storage.
     */
    async getNodes(storageUrl: string): Promise<Node[]> {
      const mindmapStorageDataset = await getSolidDataset(storageUrl, { fetch });
      const chatStorageThings = await getThingAll(mindmapStorageDataset);
      const nodes: Node[] = [];
      chatStorageThings.forEach((thing) => {
        const types = getUrlAll(thing, RDF.type);
        if (types.includes(nodeDefinition.identity)) {
          nodes.push(this.nodeLDO.read(thing));
        }
      });
      return nodes;
    }
  
    /**
     * Saves an array of nodes to Solid data storage under the given storage URL.
     * @param storageUrl - The URL of the storage where the nodes will be saved.
     * @param nodes - An array of Node objects representing the nodes to be saved.
     * @returns A Promise that resolves when the nodes are successfully saved to the storage.
     */
    async saveNodes(storageUrl: string, nodes: Node[]): Promise<void> {
      let mindMapStorageDataset = await getSolidDataset(storageUrl, { fetch });
  
      nodes.forEach(node => {
        mindMapStorageDataset = setThing(mindMapStorageDataset, this.nodeLDO.create(node));
      });
  
      await saveSolidDatasetAt(storageUrl, mindMapStorageDataset, { fetch });
    }
  }
  