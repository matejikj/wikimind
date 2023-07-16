import { fetch } from "@inrupt/solid-client-authn-browser";

import {
    getSolidDataset,
    saveSolidDatasetAt,
    setThing,
} from "@inrupt/solid-client";
import examDefinition from "../definitions/exam.json";
import { ExamLDO } from "../models/things/ExamLDO";
import { Exam } from "../models/types/Exam";
import { UserSession } from "../models/types/UserSession";


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