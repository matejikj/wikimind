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
import requestDefinition from "../definitions/request.json";
import { RequestLDO } from "../models/things/RequestLDO";
import { Request } from "../models/types/Request";


export class RequestRepository {
    private requestLDO: RequestLDO

    constructor() {
        this.requestLDO = new RequestLDO(requestDefinition);
    }

    async createRequest(requestUrl: string, request: Request): Promise<void> {
        let RequestDataset = await getSolidDataset(requestUrl, { fetch });
        RequestDataset = setThing(RequestDataset, this.requestLDO.create(request));
        await saveSolidDatasetAt(requestUrl, RequestDataset, { fetch });
    }

    async removeRequest(requestUrl: string, request: Request): Promise<void> {
        let requestDataset = await getSolidDataset(requestUrl, { fetch });
        const thingId = `${requestUrl}#${request.id}`

        const thing = getThing(requestDataset, thingId);
        if (thing) {
            requestDataset = removeThing(requestDataset, thing)
            await saveSolidDatasetAt(requestUrl, requestDataset, { fetch });
        }
    }

    async getRequests(storageUrl: string): Promise<Request[] | undefined> {
        let storageDataset = await getSolidDataset(storageUrl, { fetch });
        const storageThings = await getThingAll(storageDataset);
        const requests: Request[] = [];
        storageThings.forEach((thing) => {
            const types = getUrlAll(thing, RDF.type);
            if (types.some(type => type === requestDefinition.identity)) {
                requests.push(this.requestLDO.read(thing))
            }
        });
        await saveSolidDatasetAt(storageUrl, storageDataset, { fetch });

        return requests
    }
}


