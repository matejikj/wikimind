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


export class MindMapRepository {
    private mindMapLDO: MindMapLDO;
    private nodeLDO: NodeLDO;
    private connectionLDO: ConnectionLDO;

    constructor() {
        this.mindMapLDO = new MindMapLDO(mindMapDefinition)
        this.nodeLDO = new NodeLDO(nodeDefinition);
        this.connectionLDO = new ConnectionLDO(connectionDefinition);
    }

    async getMindMap(mindMapUrl: string): Promise<MindMap | undefined> {
        const mindMapDataset = await getSolidDataset(mindMapUrl, { fetch });
        const mindMapBuilder = new MindMapLDO(mindMapDefinition)
        const thingId = `${mindMapUrl}#${getNumberFromUrl(mindMapUrl)}`
        return mindMapBuilder.read(getThing(mindMapDataset, thingId))
    }

    async createMindMap(mindMapUrl: string, mindMap: MindMap): Promise<void> {
        let mindMapDataset = createSolidDataset();
        mindMapDataset = setThing(mindMapDataset, this.mindMapLDO.create(mindMap));
        await saveSolidDatasetAt(mindMapUrl, mindMapDataset, { fetch });
    }

    async updateMindMap(mindMap: MindMap): Promise<void> {
        const url = `${mindMap.source}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`;
        let mindMapDataset = await getSolidDataset(url, { fetch });
        mindMapDataset = setThing(mindMapDataset, this.mindMapLDO.create(mindMap));
        await saveSolidDatasetAt(url, mindMapDataset, { fetch });
    }

    async getNodesAndConnections(storageUrl: string) {
        const mindmapStorageDataset = await getSolidDataset(storageUrl, { fetch });
        const mindMapStorageThings = await getThingAll(mindmapStorageDataset);
        const nodes: Node[] = [];
        const links: Connection[] = [];
        mindMapStorageThings.forEach((thing) => {
            const types = getUrlAll(thing, RDF.type);
            if (types.includes(nodeDefinition.identity)) {
                nodes.push(this.nodeLDO.read(thing));
            }
            if (types.includes(connectionDefinition.identity)) {
                links.push(this.connectionLDO.read(thing));
            }
        });
        return {
            nodes: nodes,
            links: links
        }
    }

    async saveNodesAndConnections(storageUrl: string, nodes: Node[], connections: Connection[]): Promise<void> {
        let mindMapStorageDataset = createSolidDataset();

        nodes.forEach(node => {
            mindMapStorageDataset = setThing(mindMapStorageDataset, this.nodeLDO.create(node));
        });
        connections.forEach(connection => {
            mindMapStorageDataset = setThing(mindMapStorageDataset, this.connectionLDO.create(connection));
        });

        await saveSolidDatasetAt(storageUrl, mindMapStorageDataset, { fetch: fetch });
    }

    async removeMindMap(url: string): Promise<void> {
        await deleteSolidDataset(url, { fetch: fetch })
    }
}
