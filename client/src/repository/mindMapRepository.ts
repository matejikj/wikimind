import {
    createSolidDataset,
    deleteSolidDataset,
    getSolidDataset,
    getThing,
    getThingAll,
    getUrlAll,
    saveSolidDatasetAt,
    setThing
  } from "@inrupt/solid-client";
  import { fetch } from "@inrupt/solid-client-authn-browser";
  import { RDF } from "@inrupt/vocab-common-rdf";
  import connectionDefinition from "../definitions/connection.json";
  import mindMapDefinition from "../definitions/mindMap.json";
  import nodeDefinition from "../definitions/node.json";
  import { ConnectionLDO } from "../models/things/ConnectionLDO";
  import { MindMapLDO } from "../models/things/MindMapLDO";
  import { NodeLDO } from "../models/things/NodeLDO";
  import { Connection } from "../models/types/Connection";
  import { MindMap } from "../models/types/MindMap";
  import { Node } from "../models/types/Node";
  import { MINDMAPS, TTLFILETYPE, WIKIMIND } from "../service/containerService";
  import { getNumberFromUrl } from "./utils";
  
  /**
   * Represents a repository for managing mind map data using Solid data storage.
   */
  export class MindMapRepository {
    private mindMapLDO: MindMapLDO;
  
    /**
     * Creates a new instance of the MindMapRepository class.
     */
    constructor() {
      this.mindMapLDO = new MindMapLDO(mindMapDefinition);
    }
  
    /**
     * Retrieves a mind map from Solid data storage based on the provided mind map URL.
     * @param mindMapUrl - The URL of the mind map to retrieve.
     * @returns A Promise that resolves to a MindMap object representing the retrieved mind map, or undefined if not found.
     */
    async getMindMap(mindMapUrl: string): Promise<MindMap | undefined> {
      const mindMapDataset = await getSolidDataset(mindMapUrl, { fetch });
      const mindMapBuilder = new MindMapLDO(mindMapDefinition);
      const thingId = `${mindMapUrl}#${getNumberFromUrl(mindMapUrl)}`;
      return mindMapBuilder.read(getThing(mindMapDataset, thingId));
    }
  
    /**
     * Creates a new mind map in Solid data storage under the provided mind map URL.
     * @param mindMapUrl - The URL where the mind map will be created.
     * @param mindMap - The MindMap object representing the new mind map to be created.
     * @returns A Promise that resolves when the mind map is successfully created in the storage.
     */
    async createMindMap(mindMapUrl: string, mindMap: MindMap): Promise<void> {
      let mindMapDataset = createSolidDataset();
      mindMapDataset = setThing(mindMapDataset, this.mindMapLDO.create(mindMap));
      await saveSolidDatasetAt(mindMapUrl, mindMapDataset, { fetch });
    }
  
    /**
     * Updates an existing mind map in Solid data storage.
     * @param mindMap - The MindMap object representing the updated mind map data.
     * @returns A Promise that resolves when the mind map is successfully updated in the storage.
     */
    async updateMindMap(mindMap: MindMap): Promise<void> {
      const url = `${mindMap.source}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`;
      let mindMapDataset = await getSolidDataset(url, { fetch });
      mindMapDataset = setThing(mindMapDataset, this.mindMapLDO.create(mindMap));
      await saveSolidDatasetAt(url, mindMapDataset, { fetch });
    }
  
    /**
     * Removes a mind map from Solid data storage based on the provided URL.
     * @param url - The URL of the mind map to be removed.
     * @returns A Promise that resolves when the mind map is successfully removed from the storage.
     */
    async removeMindMap(url: string): Promise<void> {
      await deleteSolidDataset(url, { fetch: fetch });
    }
  }
  