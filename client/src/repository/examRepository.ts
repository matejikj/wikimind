import {
    createSolidDataset,
    getSolidDataset,
    getThingAll,
    getUrlAll,
    saveSolidDatasetAt,
    setThing
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { RDF } from "@inrupt/vocab-common-rdf";
import examDefinition from "../definitions/exam.json";
import { ExamLDO } from "../models/things/ExamLDO";
import { Exam } from "../models/types/Exam";


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
