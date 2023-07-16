import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    getThingAll,
    removeThing,
    getUrlAll
} from "@inrupt/solid-client";
import profileDefinition from "../definitions/profile.json";
import mindMapDefinition from "../definitions/mindMap.json";
import linkDefinition from "../definitions/link.json";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { UserSession } from "../models/types/UserSession";
import { MRIZKA, PROFILE, SLASH, TTLFILETYPE, WIKIMIND } from "../service/containerService";
import { MindMap } from "../models/types/MindMap";
import { MindMapLDO } from "../models/things/MindMapLDO";
import { getNumberFromUrl } from "./utils";
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";
import { LDO } from "../models/LDO";
import { RDF } from "@inrupt/vocab-common-rdf";


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


