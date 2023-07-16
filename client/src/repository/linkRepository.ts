import {
    getSolidDataset,
    getThing,
    getThingAll,
    getUrlAll,
    removeThing,
    saveSolidDatasetAt,
    setThing
  } from "@inrupt/solid-client";
  import { fetch } from "@inrupt/solid-client-authn-browser";
  import { RDF } from "@inrupt/vocab-common-rdf";
  import linkDefinition from "../definitions/link.json";
  import { LinkLDO } from "../models/things/LinkLDO";
  import { Link } from "../models/types/Link";
  
  /**
   * Represents a repository for managing link data using Solid data storage.
   */
  export class LinkRepository {
    private linkLDO: LinkLDO;
  
    /**
     * Creates a new instance of the LinkRepository class.
     */
    constructor() {
      this.linkLDO = new LinkLDO(linkDefinition);
    }
  
    /**
     * Retrieves a list of links from Solid data storage under the given list URL.
     * @param listUrl - The URL of the list containing the links to retrieve.
     * @returns A Promise that resolves to an array of Link objects found in the list.
     */
    async getLinksList(listUrl: string): Promise<Link[]> {
      const linksDataset = await getSolidDataset(listUrl, { fetch });
      const things = await getThingAll(linksDataset);
      const links: Link[] = [];
      things.forEach((thing) => {
        const types = getUrlAll(thing, RDF.type);
        if (types.includes(linkDefinition.identity)) {
          links.push(this.linkLDO.read(thing));
        }
      });
      return links;
    }
  
    /**
     * Creates a new link and adds it to the list in Solid data storage.
     * @param listUrl - The URL of the list where the new link will be added.
     * @param link - The Link object representing the link to be created.
     * @returns A Promise that resolves when the link is successfully created and saved to the list.
     */
    async createLink(listUrl: string, link: Link): Promise<void> {
      let linkListDataset = await getSolidDataset(listUrl, { fetch });
      linkListDataset = setThing(linkListDataset, this.linkLDO.create(link));
      await saveSolidDatasetAt(listUrl, linkListDataset, { fetch });
    }
  
    /**
     * Removes a link from the list in Solid data storage.
     * @param listUrl - The URL of the list from which the link will be removed.
     * @param link - The Link object representing the link to be removed.
     * @returns A Promise that resolves when the link is successfully removed from the list.
     */
    async removeLink(listUrl: string, link: Link): Promise<void> {
      let linkListDataset = await getSolidDataset(listUrl, { fetch });
      const thingId = `${listUrl}#${link.id}`;
      const thing = getThing(linkListDataset, thingId);
      if (thing) {
        linkListDataset = removeThing(linkListDataset, thing);
        await saveSolidDatasetAt(listUrl, linkListDataset, { fetch });
      }
    }
  }
  