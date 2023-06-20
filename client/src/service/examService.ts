import { login, handleIncomingRedirect, getDefaultSession, fetch } from "@inrupt/solid-client-authn-browser";

import {
    addUrl,
    getThing,
    getSolidDataset,
    addStringNoLocale,
    buildThing,
    createSolidDataset,
    createThing,
    setThing, hasResourceAcl, hasAccessibleAcl, createAclFromFallbackAcl, getResourceAcl,
    setUrl,
    getThingAll,
    createContainerAt, saveAclFor, acp_ess_2,
    getStringNoLocale, hasFallbackAcl,
    getUrlAll,
    getSolidDatasetWithAcl,
    getUrl,
    getPodUrlAll,
    isContainer,
    getContainedResourceUrlAll,
    Thing, universalAccess,
    getLinkedResourceUrlAll,
    saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { MindMapLDO } from "../models/things/MindMapLDO";
import nodeDefinition from "../definitions/node.json"
import linkDefinition from "../definitions/link.json"
import mindMapDefinition from "../definitions/mindMapMetaData.json"
import profileDefinition from "../definitions/profile.json"
import examDefinition from "../definitions/examDefinition.json"
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { NodeLDO } from "../models/things/NodeLDO";
import { Connection } from "../models/types/Connection";
import { ConnectionLDO } from "../models/things/ConnectionLDO";
import { MindMap } from "../models/types/MindMap";
import { UserSession } from "../models/types/UserSession";
import { initializeAcl, isWacOrAcp } from "./accessService";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";
import { getProfile } from "./profileService";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { Exam } from "../models/types/Exam";
import { generate_uuidv4 } from "./utils";
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