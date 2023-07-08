import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    getThingAll,
    getUrlAll,
    createSolidDataset
} from "@inrupt/solid-client";
import profileDefinition from "../definitions/profile.json";
import mindMapDefinition from "../definitions/mindMap.json";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { UserSession } from "../models/types/UserSession";
import { MRIZKA, PROFILE, SLASH, TTLFILETYPE, WIKIMIND } from "../service/containerService";
import { MindMap } from "../models/types/MindMap";
import { MindMapLDO } from "../models/things/MindMapLDO";
import { getNumberFromUrl } from "./utils";
import { Connection } from "../models/types/Connection";
import { NodeLDO } from "../models/things/NodeLDO";
import { ConnectionLDO } from "../models/things/ConnectionLDO";
import nodeDefinition from "../definitions/node.json";
import connectionDefinition from "../definitions/connection.json";
import { RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";


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

    async updateMindMap(mindMapUrl: string, mindMap: MindMap): Promise<MindMap | undefined> {
        const mindMapDataset = await getSolidDataset(mindMapUrl, { fetch });
        const mindMapBuilder = new MindMapLDO(mindMapDefinition)
        const thingId = `${mindMapUrl}#${getNumberFromUrl(mindMapUrl)}`
        return mindMapBuilder.read(getThing(mindMapDataset, thingId))
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
}
