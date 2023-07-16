import {
    createSolidDataset,
    deleteSolidDataset,
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import classDefinition from "../definitions/class.json";
import connectionDefinition from "../definitions/connection.json";
import examDefinition from "../definitions/exam.json";
import linkDefinition from "../definitions/link.json";
import mindMapDefinition from "../definitions/mindMap.json";
import nodeDefinition from "../definitions/node.json";
import { ClassLDO } from "../models/things/ClassLDO";
import { ConnectionLDO } from "../models/things/ConnectionLDO";
import { ExamLDO } from "../models/things/ExamLDO";
import { LinkLDO } from "../models/things/LinkLDO";
import { MindMapLDO } from "../models/things/MindMapLDO";
import { NodeLDO } from "../models/things/NodeLDO";
import { Class } from "../models/types/Class";
import { getNumberFromUrl } from "./utils";


export class ClassRepository {
    private mindMapLDO: MindMapLDO;
    private nodeLDO: NodeLDO;
    private connectionLDO: ConnectionLDO;
    private classLDO: ClassLDO;
    private examLDO: ExamLDO;
    private linkLDO: LinkLDO;

    constructor() {
        this.mindMapLDO = new MindMapLDO(mindMapDefinition)
        this.nodeLDO = new NodeLDO(nodeDefinition);
        this.connectionLDO = new ConnectionLDO(connectionDefinition);
        this.examLDO = new ExamLDO(examDefinition);
        this.classLDO = new ClassLDO(classDefinition);
        this.linkLDO = new LinkLDO(linkDefinition);
    }

    async getClass(classUrl: string): Promise<Class | undefined> {
        const mindMapDataset = await getSolidDataset(classUrl, { fetch });
        const thingId = `${classUrl}#${getNumberFromUrl(classUrl)}`
        return this.classLDO.read(getThing(mindMapDataset, thingId))
    }

    async createClass(classUrl: string, classObject: Class): Promise<void> {
        let classDataset = createSolidDataset();
        classDataset = setThing(classDataset, this.classLDO.create(classObject));
        await saveSolidDatasetAt(classUrl, classDataset, { fetch });
    }

    async removeClass(classUrl: string): Promise<void> {
        await deleteSolidDataset(classUrl, { fetch: fetch })
    }
}
