import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    getThingAll,
    getUrlAll,
    createSolidDataset,
    deleteSolidDataset
} from "@inrupt/solid-client";
import profileDefinition from "../definitions/profile.json";
import mindMapDefinition from "../definitions/mindMap.json";
import classDefinition from "../definitions/class.json";
import examDefinition from "../definitions/exam.json";
import linkDefinition from "../definitions/link.json";
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
import { ClassLDO } from "../models/things/ClassLDO";
import { Class } from "../models/types/Class";
import { Exam } from "../models/types/Exam";
import { ExamLDO } from "../models/things/ExamLDO";
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";


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

    async updateMindMap(classUrl: string, mindMap: MindMap): Promise<Class | undefined> {
        const mindMapDataset = await getSolidDataset(classUrl, { fetch });
        const thingId = `${classUrl}#${getNumberFromUrl(classUrl)}`
        return this.classLDO.read(getThing(mindMapDataset, thingId))
    }

    async getClassLinks(storageUrl: string) {
        const classStorageDataset = await getSolidDataset(storageUrl, { fetch });
        const classStorageThings = await getThingAll(classStorageDataset);
        const links: Link[] = [];
        classStorageThings.forEach((thing) => {
            const types = getUrlAll(thing, RDF.type);
            if (types.includes(linkDefinition.identity)) {
                links.push(this.linkLDO.read(thing));
            }
        });
        return links
    }

    async getExams(storageUrl: string) {
        const classStorageDataset = await getSolidDataset(storageUrl, { fetch });
        const classStorageThings = await getThingAll(classStorageDataset);
        const exams: Exam[] = [];
        classStorageThings.forEach((thing) => {
            const types = getUrlAll(thing, RDF.type);
            if (types.includes(examDefinition.identity)) {
                exams.push(this.examLDO.read(thing));
            }
        });
        return exams
    }
}
