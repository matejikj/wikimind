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


export class LinkRepository {
    private linkLDO: LinkLDO
  
    constructor() {
      this.linkLDO = new LinkLDO(linkDefinition);
    }
  
    async getLinksList(listUrl: string): Promise<Link[]> {
        const linksDataset = await getSolidDataset(listUrl, { fetch });
        const things = await getThingAll(linksDataset);
        const links: Link[] = [];
        things.forEach((thing) => {
            const types = getUrlAll(thing, RDF.type);
            if (types.includes(linkDefinition.identity)) {
                links.push(this.linkLDO.read(thing));
            }
        })
        return links
    }

    async createLink(listUrl: string, link: Link): Promise<void> {
        let mindMapListDataset = await getSolidDataset(listUrl, { fetch });
        mindMapListDataset = setThing(mindMapListDataset, this.linkLDO.create(link));
        await saveSolidDatasetAt(listUrl, mindMapListDataset, { fetch });
    }

    async removeLink(listUrl: string, link: Link): Promise<void> {
        let mindMapListDataset = await getSolidDataset(listUrl, { fetch });
        const thingId = `${listUrl}#${link.id}`;
        const thing = getThing(mindMapListDataset, thingId);
        if (thing) {
            mindMapListDataset = removeThing(mindMapListDataset, thing);
            await saveSolidDatasetAt(listUrl, mindMapListDataset, { fetch });    
        }
    }
}


