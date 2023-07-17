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
  import connectionDefinition from "../definitions/connection.json";
  import { ConnectionLDO } from "../models/things/ConnectionLDO";
  import { Connection } from "../models/types/Connection";
  
  /**
   * Represents a repository for managing connection data using Solid data storage.
   */
  export class ConnectionRepository {
    private connectionLDO: ConnectionLDO;
  
    /**
     * Creates a new instance of the ConnectionRepository class.
     */
    constructor() {
      this.connectionLDO = new ConnectionLDO(connectionDefinition);
    }
  
    /**
     * Retrieves all connections from Solid data storage under the given storage URL.
     * @param storageUrl - The URL of the storage where the connections are located.
     * @returns A Promise that resolves to an array of Connection objects found in the storage.
     */
    async getConnections(storageUrl: string): Promise<Connection[]> {
      const mindmapStorageDataset = await getSolidDataset(storageUrl, { fetch });
      const chatStorageThings = await getThingAll(mindmapStorageDataset);
      const connections: Connection[] = [];
      chatStorageThings.forEach((thing) => {
        const types = getUrlAll(thing, RDF.type);
        if (types.includes(connectionDefinition.identity)) {
          connections.push(this.connectionLDO.read(thing));
        }
      });
      return connections;
    }
  
    /**
     * Saves an array of connections to Solid data storage under the given storage URL.
     * @param storageUrl - The URL of the storage where the connections will be saved.
     * @param connections - An array of Connection objects representing the connections to be saved.
     * @returns A Promise that resolves when the connections are successfully saved to the storage.
     */
    async saveConnections(storageUrl: string, connections: Connection[]): Promise<void> {
      let mindMapStorageDataset = await getSolidDataset(storageUrl, { fetch });
  
      connections.forEach(connection => {
        mindMapStorageDataset = setThing(mindMapStorageDataset, this.connectionLDO.create(connection));
      });
  
      await saveSolidDatasetAt(storageUrl, mindMapStorageDataset, { fetch });
    }
  }
  