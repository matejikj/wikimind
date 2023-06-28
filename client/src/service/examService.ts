import { fetch } from "@inrupt/solid-client-authn-browser";

import {
    getSolidDataset,
    saveSolidDatasetAt,
    setThing,
} from "@inrupt/solid-client";
import examDefinition from "../definitions/exam.json"
import { UserSession } from "../models/types/UserSession";
import { Exam } from "../models/types/Exam";
import { ExamLDO } from "../models/things/ExamLDO";


export async function addExamResult(userSession: UserSession, exam: Exam, classUrl: string) {

    const profileLDO = new ExamLDO(examDefinition).create(exam)
    const myDataset = await getSolidDataset(
        classUrl,
        { fetch: fetch }
    );

    const savedProfileSolidDataset = setThing(myDataset, profileLDO)
    const savedSolidDataset = await saveSolidDatasetAt(
        classUrl,
        savedProfileSolidDataset,
        { fetch: fetch }
    );
}