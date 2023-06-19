import { login, handleIncomingRedirect, getDefaultSession, fetch } from "@inrupt/solid-client-authn-browser";

import {
    addUrl,
    getThing,
    getSolidDataset,
    addStringNoLocale,
    buildThing,
    getPodOwner,
    createSolidDataset,
    createThing,
    setThing,
    removeThing,
    getFile, getProfileAll, getPodUrlAllFrom,
    deleteFile,
    setUrl,
    getThingAll,
    getSolidDatasetWithAcl,
    createContainerAt,
    getResourceInfo,
    getStringNoLocale,
    getUrlAll,
    getUrl, getContainedResourceUrlAll,
    getAgentAccessAll,
    saveFileInContainer, getSourceUrl,
    universalAccess,
    Thing, getWebIdDataset,
    getLinkedResourceUrlAll,
    saveSolidDatasetAt,
} from "@inrupt/solid-client";
import {
    AccessGrant,
    approveAccessRequest,
    denyAccessRequest
}
    from "@inrupt/solid-client-access-grants"
import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { MindMapLDO } from "../models/things/MindMapLDO";
import examDefinition from "../definitions/examDefinition.json"
import chatDefinition from "../definitions/chat.json"
import classRequestDefinition from "../definitions/classRequest.json"
import classRequestGrantDefinition from "../definitions/classRequestGrant.json"
import profileDefinition from "../definitions/profile.json"
import messageDefinition from "../definitions/messageDefinition.json"
import nodeDefinition from "../definitions/node.json"
import linkDefinition from "../definitions/link.json"
import mindMapDefinition from "../definitions/mindMapMetaData.json"
import classDefinition from "../definitions/class.json"
import datasetLinkDefinition from "../definitions/datasetLink.json"
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { NodeLDO } from "../models/things/NodeLDO";
import { Connection } from "../models/types/Connection";
import { ConnectionLDO } from "../models/things/ConnectionLDO";
import { MindMap } from "../models/types/MindMap";
import { getPodUrl } from "./containerService";
import { generate_uuidv4 } from "./utils";
import { Class, Class as TeachClass } from "../models/types/Class";
import { ClassLDO } from "../models/things/ClassLDO";
import { getProfile } from "./profileService";
import { Link } from "../models/types/Link";
import { DatasetLinkLDO } from "../models/things/DatasetLinkLDO";
import { LinkType } from "../models/types/LinkType";
import { AccessRequest, issueAccessRequest, redirectToAccessManagementUi } from "@inrupt/solid-client-access-grants";
import { UserSession } from "../models/types/UserSession";
import { ClassDataset } from "../models/types/ClassDataset";
import { Exam } from "../models/types/Exam";
import { Profile } from "../models/types/Profile";
import { ExamLDO } from "../models/things/ExamLDO";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { Request } from "../models/types/Request";
import { getMindMap } from "./mindMapService";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";
import { initializeAcl } from "./accessService";
import { ClassRequestLDO } from "../models/things/ClassRequestLDO";
import { Grant } from "../models/types/Grant";
import { ClassRequestGrantLDO } from "../models/things/ClassRequestGrantLDO";
import { ChatLDO } from "../models/things/ChatLDO";
import { storage } from "rdf-namespaces/dist/space";

// https://id.inrupt.com/matejikj?classId=d91f706d-ca0c-41aa-844b-cf47d1ef4c40


export async function createNewClass(name: string, userSession: UserSession) {
    const podUrl = userSession.podUrl + 'Wikie/classes/classes.ttl'
    const teacherProfile = await getProfile(userSession)
    const blankClass: TeachClass = {
        name: name,
        id: generate_uuidv4(),
        teacher: userSession.webId,
        storage: userSession.podUrl
    }

    const datasetLink: Link = {
        id: generate_uuidv4(),
        url: userSession.podUrl + "Wikie/classes/" + blankClass.id + ".ttl",
        linkType: LinkType.CLASS_LINK
    }
    const classLDO = new DatasetLinkLDO(datasetLinkDefinition).create(datasetLink)
    let myDataset = await getSolidDataset(
        podUrl,
        { fetch: fetch }
    );
    myDataset = setThing(myDataset, classLDO)
    let newName = podUrl + "Wikie/classes/" + "classes" + ".ttl"

    let courseSolidDataset = createSolidDataset();
    const classDataset = new ClassLDO(classDefinition).create(blankClass)
    courseSolidDataset = setThing(courseSolidDataset, classDataset)
    let newClassDataset = userSession.podUrl + "Wikie/classes/" + blankClass.id + ".ttl"

    const savedSolidDatasetContainer = await saveSolidDatasetAt(
        podUrl,
        myDataset,
        { fetch: fetch }
    );
    const savedSolidDataset = await saveSolidDatasetAt(
        newClassDataset,
        courseSolidDataset,
        { fetch: fetch }
    );

    if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
        initializeAcl(newClassDataset)
    }


    return newName
}

export async function getClassDataset(userSession: UserSession, classPodUrl: string) {
    const myDataset = await getSolidDataset(
        classPodUrl,
        { fetch: fetch }
    );
    const things = await getThingAll(myDataset);
    console.log(things)

    let newClass: TeachClass | null = null;
    let classBuilder = new ClassLDO(classDefinition)
    let mindMaps: MindMapDataset[] = []
    let exams: Exam[] = []
    let examBuilder = new ExamLDO(examDefinition)
    let profiles: Profile[] = []
    let profileBuilder = new ProfileLDO(profileDefinition);
    let datasetLinkBuilder = new DatasetLinkLDO(datasetLinkDefinition)

    await Promise.all(things.map(async (thing) => {
        const types = getUrlAll(thing, RDF.type);
        if (types.some(type => type === datasetLinkDefinition.identity.subject)) {
            const newLink = datasetLinkBuilder.read(thing)
            if (newLink.linkType === LinkType.PROFILE_LINK) {
                // const podUrls = await getPodUrl(newLink.url)
                // if (podUrls !== null) {
                //     const podUrl = podUrls[0]
                //     let bb = getThing(myExtendedProfile, podUrl + "profile#Wikie");
                //     let profileBuilder = new ProfileLDO((profileDefinition as LDO<Profile>))
                //     let userProfile = profileBuilder.read(bb)
                //     console.log(userProfile)
                //     profiles.push(userProfile)
                // }
            }
            if (newLink.linkType === LinkType.GRAPH_LINK) {
                const mindMap = await getMindMap(newLink.url)
                if (mindMap !== null) {
                    mindMaps.push(mindMap)
                }
            }
        }
        if (types.some(type => type === examDefinition.identity.subject)) {
            // const newLink = datasetLinkBuilder.read(thing)
        }
        if (types.some(type => type === classDefinition.identity.subject)) {
            newClass = classBuilder.read(thing)
            console.log(newClass)
        }
    }))

    if (newClass !== null) {
        newClass = newClass as TeachClass
        const classDataset: ClassDataset = {
            id: newClass.id,
            name: newClass.name,
            storage: newClass.storage,
            teacher: newClass.teacher,
            mindMaps: mindMaps,
            students: profiles,
            testResults: exams
        }
        return classDataset
    } else {
        return null
    }
}

export async function allowAccess(userSession: UserSession, classRequest: Request) {
    const podUrls = await getPodUrl(classRequest.requestor)
    console.log(podUrls)
    if (podUrls !== null) {

        // VLOZIT ZAKA DO TRIDY
        const datasetLink: Link = {
            id: generate_uuidv4(),
            url: classRequest.requestor,
            linkType: LinkType.PROFILE_LINK
        }
        const classLDO = new DatasetLinkLDO(datasetLinkDefinition).create(datasetLink)
        let myDataset = await getSolidDataset(
            classRequest.class,
            { fetch: fetch }
        );
        const newDAtaset = setThing(myDataset, classLDO)
        const savedSolidDatasetContainer = await saveSolidDatasetAt(
            classRequest.class,
            newDAtaset,
            { fetch: fetch }
        );

        universalAccess.setAgentAccess(
            classRequest.class,
            classRequest.requestor,     // Agent
            { append: true, read: true, write: false },          // Access object
            { fetch: fetch }    // fetch function from authenticated session
        ).then((newAccess) => {
            console.log(newAccess)
        });

        // ODESLAT ZAKOVI POTVRZENI

        const newRequst = new ClassRequestGrantLDO(classRequestGrantDefinition).create({
            id: generate_uuidv4(),
            class: classRequest.class
        })

        let grantDataset = await getSolidDataset(
            podUrls[0] + "Wikie/classes/requests.ttl",
            { fetch: fetch }
        );
        console.log(grantDataset)
        const grantProfileThing = setThing(grantDataset, newRequst)
        const savedGrantProfileDatatset = await saveSolidDatasetAt(
            podUrls[0] + "Wikie/classes/requests.ttl",
            grantProfileThing,
            { fetch: fetch }
        );

        // VYTVORIT CHAT

        let messageDatasetUrl = userSession.podUrl + "Wikie/messages/" + generate_uuidv4() + ".ttl"

        const newChat = new ChatLDO(chatDefinition).create({
            id: generate_uuidv4(),
            owner: userSession.webId,
            guest: classRequest.requestor,
            modified: '19.6.2023',
            lastMessage: '',
            storage: userSession.podUrl
        })

        let chatSolidDataset = createSolidDataset();
        const newProfileDataset = setThing(chatSolidDataset, newChat)
        const messageDataset = await saveSolidDatasetAt(
            messageDatasetUrl,
            newProfileDataset,
            { fetch: fetch }
        );

        if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
            await initializeAcl(messageDatasetUrl)
        }

        // PRIDELIT ZAKOVI PRISTUP KE SPOLECNEMU CHATU
        universalAccess.setAgentAccess(
            messageDatasetUrl,
            classRequest.requestor,
            { append: true, read: true, write: false },
            { fetch: fetch }
        ).then((newAccess) => {
            console.log(newAccess)
        });


        // VYTVORIT CHAT LINK

        const newChatLink = new DatasetLinkLDO(datasetLinkDefinition).create({
            id: generate_uuidv4(),
            linkType: LinkType.CHAT_LINK,
            url: messageDatasetUrl
        })


        // ULOZIT CHAT ZAKOVI DO KONTAKTU

        let myContactsDataset = await getSolidDataset(
            userSession.podUrl + "Wikie/messages/contacts.ttl",
            { fetch: fetch }
        );

        const newTeacherProfileThing = setThing(myContactsDataset, newChatLink)
        const savedTeacherProfileDatatset = await saveSolidDatasetAt(
            userSession.podUrl + "Wikie/messages/contacts.ttl",
            newTeacherProfileThing,
            { fetch: fetch }
        );


        // ULOZIT CHAT ZAKOVI DO KONTAKTU

        let studentsContactsDataset = await getSolidDataset(
            podUrls[0] + "Wikie/messages/contacts.ttl",
            { fetch: fetch }
        );

        const newProfileThing = setThing(studentsContactsDataset, newChatLink)
        const savedProfileDatatset = await saveSolidDatasetAt(
            podUrls[0] + "Wikie/messages/contacts.ttl",
            newProfileThing,
            { fetch: fetch }
        );
    }
}

export async function denyRequest(userSession: UserSession, classRequest: Request) {
}

export async function getRequests(userSession: UserSession) {
    let myDataset = await getSolidDataset(
        userSession.podUrl + "Wikie/classes/requests.ttl",
        { fetch: fetch }          // fetch from authenticated session
    );
    const resourceUrls = await getContainedResourceUrlAll(myDataset);
    console.log(resourceUrls)
    const array: Request[] = []

    const things = await getThingAll(myDataset);

    let classRequestLDO = new ClassRequestLDO(classRequestDefinition)
    let classRequestGrantLDO = new ClassRequestGrantLDO(classRequestGrantDefinition)
    let classRequests: Request[] = []
    let classRequestGrants: Grant[] = []

    things.forEach(thing => {
        const types = getUrlAll(thing, RDF.type);
        console.log(types)
        if (types.some(type => type === classRequestDefinition.identity.subject)) {
            classRequests.push(classRequestLDO.read(thing))
        }
        if (types.some(type => type === classRequestGrantDefinition.identity.subject)) {
            classRequestGrants.push(classRequestGrantLDO.read(thing))
            myDataset = removeThing(myDataset, thing)
        }
    });

    const savedSolidDatasetContainer = await saveSolidDatasetAt(
        userSession.podUrl + "Wikie/classes/requests.ttl",
        myDataset,
        { fetch: fetch }
    );

    await Promise.all(classRequestGrants.map(async (item) => {
        const datasetLink: Link = {
            id: generate_uuidv4(),
            url: item.class,
            linkType: LinkType.CLASS_LINK
        }
        const classLDO = new DatasetLinkLDO(datasetLinkDefinition).create(datasetLink)
        let myDataset = await getSolidDataset(
            userSession.podUrl + "Wikie/classes/classes.ttl",
            { fetch: fetch }
        );
        const newDAtaset = setThing(myDataset, classLDO)
        const savedSolidDatasetContainer = await saveSolidDatasetAt(
            userSession.podUrl + "Wikie/classes/classes.ttl",
            newDAtaset,
            { fetch: fetch }
        );
    }))
    return classRequests
}

export async function requestClass(userSession: UserSession, classUri: string) {
    let paramString = classUri.split('?')[1];
    let webId = classUri.split('?')[0];
    const urlParams = new URLSearchParams(paramString);
    let classId = (urlParams.get("classId"))

    const podUrls = await getPodUrl(webId)
    console.log(podUrls)
    if (podUrls !== null) {
        const dataUrl = podUrls[0] + "Wikie/classes/" + classId + ".ttl"
        console.log(dataUrl)

        const newRequst = new ClassRequestLDO(classRequestDefinition).create({
            id: generate_uuidv4(),
            class: dataUrl,
            requestor: userSession.webId
        })

        universalAccess.setAgentAccess(
            userSession.podUrl + 'Wikie/messages/contacts.ttl',
            webId,     // Agent
            { append: true, read: true, write: false },          // Access object
            { fetch: fetch }    // fetch function from authenticated session
        ).then((newAccess) => {
            console.log('newAccess')
        });


        console.log(podUrls[0] + "Wikie/classes/requests.ttl")

        let myContactsDataset = await getSolidDataset(
            podUrls[0] + "Wikie/classes/requests.ttl",
            { fetch: fetch }
        );
        console.log(myContactsDataset)
        const newProfileThing = setThing(myContactsDataset, newRequst)
        const savedProfileDatatset = await saveSolidDatasetAt(
            podUrls[0] + "Wikie/classes/requests.ttl",
            newProfileThing,
            { fetch: fetch }
        );
    }
}


export async function getClassesList(userSession: UserSession) {
    let classes: Class[] = []
    const podUrl = userSession.podUrl + 'Wikie/classes/classes.ttl'

    const myDataset = await getSolidDataset(
        podUrl,
        { fetch: fetch }
    );
    const things = await getThingAll(myDataset);
    let datasetLinkBuilder = new DatasetLinkLDO(datasetLinkDefinition)
    await Promise.all(things.map(async (thing) => {

        // things.forEach(async thing => {
        const types = getUrlAll(thing, RDF.type);
        if (types.some(type => type === datasetLinkDefinition.identity.subject)) {
            const link = datasetLinkBuilder.read(thing)
            if (link.linkType === LinkType.CLASS_LINK) {

                // classes.push(link)

                const myDataset = await getSolidDataset(
                    link.url,
                    { fetch: fetch }
                );
                const things = await getThingAll(myDataset);

                let classBuilder = new ClassLDO(classDefinition)
                let mindMap: Class | null = null;

                things.forEach(thing => {
                    const types = getUrlAll(thing, RDF.type);
                    if (types.some(type => type === classDefinition.identity.subject)) {
                        classes.push(classBuilder.read(thing))
                    }
                });
            }
        }
    }));
    return classes;
}

export async function addGraphToClass(userSession: UserSession, graphUrl: string, classUrl: string) {
    const datasetLink: Link = {
        id: generate_uuidv4(),
        url: graphUrl,
        linkType: LinkType.GRAPH_LINK
    }
    const classLDO = new DatasetLinkLDO(datasetLinkDefinition).create(datasetLink)
    let myDataset = await getSolidDataset(
        classUrl,
        { fetch: fetch }
    );
    const newDAtaset = setThing(myDataset, classLDO)
    const savedSolidDatasetContainer = await saveSolidDatasetAt(
        classUrl,
        newDAtaset,
        { fetch: fetch }
    );
    universalAccess.setPublicAccess(
        graphUrl,         // Resource
        { append: true, read: true, write: false },          // Access object
        { fetch: fetch }                         // fetch function from authenticated session
    ).then((newAccess) => {
        console.log("newAccess       contacts.ttl")
    });

}