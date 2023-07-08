import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    getThingAll,
    getUrlAll,
    removeThing
} from "@inrupt/solid-client";
import profileDefinition from "../definitions/profile.json";
import mindMapDefinition from "../definitions/mindMap.json";
import grantDefinition from "../definitions/grant.json";
import requestDefinition from "../definitions/request.json";
import linkDefinition from "../definitions/link.json";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { UserSession } from "../models/types/UserSession";
import { MRIZKA, PROFILE, SLASH, TTLFILETYPE, WIKIMIND } from "../service/containerService";
import { MindMap } from "../models/types/MindMap";
import { Request } from "../models/types/Request";
import { MindMapLDO } from "../models/things/MindMapLDO";
import { getNumberFromUrl } from "./utils";
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";
import { LDO } from "../models/LDO";
import { RequestLDO } from "../models/things/RequestLDO";
import { GrantLDO } from "../models/things/GrantLDO";
import { Grant } from "../models/types/Grant";
import { RDF } from "@inrupt/vocab-common-rdf";


export class GrantRepository {
    private grantLDO: GrantLDO
    private requestLDO: RequestLDO

    constructor() {
        this.grantLDO = new GrantLDO(grantDefinition);
        this.requestLDO = new RequestLDO(requestDefinition);
    }

    async getGrant(grantUrl: string): Promise<Grant | undefined> {
        const grantDataset = await getSolidDataset(grantUrl, { fetch });
        const thingId = `${grantUrl}#${getNumberFromUrl(grantUrl)}`
        return this.grantLDO.read(getThing(grantDataset, thingId))
    }

    async createGrant(requestUrl: string, grant: Grant): Promise<void> {
        let RequestDataset = await getSolidDataset(requestUrl, { fetch });
        RequestDataset = setThing(RequestDataset, this.grantLDO.create(grant));
        await saveSolidDatasetAt(requestUrl, RequestDataset, { fetch });
    }

    async getGrantsAndRequests(storageUrl: string) {
        let storageDataset = await getSolidDataset(storageUrl, { fetch });
        const storageThings = await getThingAll(storageDataset);
        const grants: Grant[] = [];
        const requests: Request[] = [];
        storageThings.forEach((thing) => {
            const types = getUrlAll(thing, RDF.type);
            if (types.some(type => type === requestDefinition.identity)) {
                requests.push(this.requestLDO.read(thing))
            }
            if (types.some(type => type === grantDefinition.identity)) {
                grants.push(this.grantLDO.read(thing))
                storageDataset = removeThing(storageDataset, thing)
            }
        });
        await saveSolidDatasetAt(storageUrl, storageDataset, { fetch });

        return {
            grants: grants,
            requests: requests
        }
    }
}


