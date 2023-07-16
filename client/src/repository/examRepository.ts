import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    getThingAll,
    getUrlAll,
    createSolidDataset,
    removeThing
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
import chatDefinition from "../definitions/chat.json";
import examDefinition from "../definitions/exam.json";
import connectionDefinition from "../definitions/connection.json";
import { RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { Chat } from "../models/types/Chat";
import { ChatLDO } from "../models/things/ChatLDO";
import { Exam } from "../models/types/Exam";
import { ExamLDO } from "../models/things/ExamLDO";


export class ExamRepository {
    private examLDO: ExamLDO

    constructor() {
        this.examLDO = new ExamLDO(examDefinition);
    }

    async createExam(classUrl: string, classObject: Exam): Promise<void> {
        let classDataset = createSolidDataset();
        classDataset = setThing(classDataset, this.examLDO.create(classObject));
        await saveSolidDatasetAt(classUrl, classDataset, { fetch });
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
