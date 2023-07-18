import {
    getSolidDataset,
    getThing,
    getThingAll,
    getUrlAll,
    removeThing,
    saveSolidDatasetAt,
    setThing,
  } from "@inrupt/solid-client";
  import { fetch } from "@inrupt/solid-client-authn-browser";
  import { RDF } from "@inrupt/vocab-common-rdf";
  import requestDefinition from "../definitions/request.json";
  import { RequestLDO } from "../models/things/RequestLDO";
  import { Request } from "../models/types/Request";
  
  /**
   * Represents a repository for managing requests using Solid data storage.
   */
  export class RequestRepository {
    private requestLDO: RequestLDO;
  
    constructor() {
      this.requestLDO = new RequestLDO(requestDefinition);
    }
  
    /**
     * Creates a new request and stores it in Solid data storage.
     * @param requestUrl - The URL where the request should be stored.
     * @param request - The Request object representing the new request.
     * @returns A Promise that resolves when the request is created successfully.
     */
    async createRequest(requestUrl: string, request: Request): Promise<void> {
      let requestDataset = await getSolidDataset(requestUrl, { fetch });
      requestDataset = setThing(requestDataset, this.requestLDO.create(request));
      await saveSolidDatasetAt(requestUrl, requestDataset, { fetch });
    }
  
    /**
     * Removes a request from Solid data storage.
     * @param requestUrl - The URL where the request is stored.
     * @param request - The Request object representing the request to be removed.
     * @returns A Promise that resolves when the request is removed successfully.
     */
    async removeRequest(requestUrl: string, request: Request): Promise<void> {
      let requestDataset = await getSolidDataset(requestUrl, { fetch });
      const thingId = `${requestUrl}#${request.id}`;
  
      const thing = getThing(requestDataset, thingId);
      if (thing) {
        requestDataset = removeThing(requestDataset, thing);
        await saveSolidDatasetAt(requestUrl, requestDataset, { fetch });
      }
    }
  
    /**
     * Retrieves a list of requests from Solid data storage.
     * @param storageUrl - The URL of the storage containing the requests.
     * @returns A Promise that resolves to an array of Request objects representing the retrieved requests, or undefined if there are no requests.
     */
    async getRequests(storageUrl: string): Promise<Request[] | undefined> {
      let storageDataset = await getSolidDataset(storageUrl, { fetch });
      const storageThings = await getThingAll(storageDataset);
      const requests: Request[] = [];
      storageThings.forEach((thing) => {
        const types = getUrlAll(thing, RDF.type);
        if (types.some((type) => type === requestDefinition.identity)) {
          requests.push(this.requestLDO.read(thing));
        }
      });
      await saveSolidDatasetAt(storageUrl, storageDataset, { fetch });
  
      return requests;
    }
  }
  