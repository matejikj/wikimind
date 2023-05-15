import { login, handleIncomingRedirect, getDefaultSession, fetch } from "@inrupt/solid-client-authn-browser";

import {
    addUrl,
    getThing,
    getSolidDataset,
    addStringNoLocale,
    buildThing,
    createSolidDataset,
    createThing,
    setThing,
    setUrl,
    getThingAll,
    createContainerAt,
    getStringNoLocale,
    getUrlAll,
    getUrl,
    Thing,
    getLinkedResourceUrlAll,
    saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { MindMapLDO } from "../models/things/MindMapLDO";
import nodeDefinition from "../definitions/node.json"
import linkDefinition from "../definitions/link.json"
import mindMapDefinition from "../definitions/mindMapMetaData.json"
import classDefinition from "../definitions/class.json"
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { NodeLDO } from "../models/things/NodeLDO";
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";
import { MindMap } from "../models/types/MindMap";
import { getPodUrl } from "./containerService";
import { generate_uuidv4 } from "./utils";
import { Class, Class as TeachClass } from "../models/types/Class";
import { ClassLDO } from "../models/things/ClassLDO";
import { getProfile } from "./profileService";

export async function createNewClass(name: string, sessionId: string) {
    // if (!getDefaultSession().info.isLoggedIn) {
    //   await login({
    //     oidcIssuer: "https://login.inrupt.com/",
    //     redirectUrl: window.location.href,
    //     clientName: "My application"
    //   });
    // }

    const podUrls = await getPodUrl(sessionId)
    if (podUrls !== null) {
        const podUrl = podUrls[0]
        let courseSolidDataset = createSolidDataset();

        const teacherProfile = await getProfile(sessionId)
        const teacherName = teacherProfile?.name + ' ' + teacherProfile?.surname
        const blankClass: TeachClass = {
            name: name,
            id: generate_uuidv4(),
            teacher: teacherName,
            storage: sessionId
        }

        const classLDO = new ClassLDO(classDefinition).create(blankClass)
        courseSolidDataset = setThing(courseSolidDataset, classLDO)
        let newName = podUrl + "Wikie/classes/" + "classes" + ".ttl"

        const savedSolidDataset = await saveSolidDatasetAt(
            newName,
            courseSolidDataset,
            { fetch: fetch }
        );
        return newName
    }
}

export async function addClass(name: string, sessionId: string) {
    // if (!getDefaultSession().info.isLoggedIn) {
    //   await login({
    //     oidcIssuer: "https://login.inrupt.com/",
    //     redirectUrl: window.location.href,
    //     clientName: "My application"
    //   });
    // }

    // const podUrls = await getPodUrl(sessionId)
    // if (podUrls !== null) {
    //     const podUrl = podUrls[0]
    //     let courseSolidDataset = createSolidDataset();

    //     const teacherProfile = await getProfile(sessionId)
    //     const teacherName = teacherProfile?.name + ' ' + teacherProfile?.surname
    //     const blankClass: TeachClass = {
    //         name: name,
    //         id: generate_uuidv4(),
    //         teacher: teacherName,
    //         storage: sessionId
    //     }

    //     const classLDO = new ClassLDO(classDefinition).create(blankClass)
    //     courseSolidDataset = setThing(courseSolidDataset, classLDO)
    //     let newName = podUrl + "Wikie/classes/" + "classes" + ".ttl"

    //     const savedSolidDataset = await saveSolidDatasetAt(
    //         newName,
    //         courseSolidDataset,
    //         { fetch: fetch }
    //     );
    //     return newName
    // }
}


export async function getClassesList(url: string) {
    console.log(url)
    let classes: Class[] = []
    const podUrls = await getPodUrl(url)
    console.log(podUrls)
    if (podUrls !== null) {
        const podUrl = podUrls[0] + 'Wikie/classes/classes.ttl'
    
        const myDataset = await getSolidDataset(
            podUrl,
            { fetch: fetch }
        );
    
        const things = await getThingAll(myDataset);
    
        
        let classBuilder = new ClassLDO(classDefinition)
    
        things.forEach(thing => {
            const types = getUrlAll(thing, RDF.type);
            if (types.some(type => type === classDefinition.identity.subject)) {
                classes.push(classBuilder.read(thing))
            }
        });
    
        console.log(classes)
        
    }
    return classes;
    
}