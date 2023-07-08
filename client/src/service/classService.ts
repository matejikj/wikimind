import { fetch } from "@inrupt/solid-client-authn-browser";

import {
    createSolidDataset,
    getContainedResourceUrlAll,
    getSolidDataset,
    getThing,
    getThingAll,
    getUrlAll,
    removeThing, saveSolidDatasetAt,
    setThing,
    universalAccess,
} from "@inrupt/solid-client";



import { RDF } from "@inrupt/vocab-common-rdf";
import examDefinition from "../definitions/exam.json"
import chatDefinition from "../definitions/chat.json"
import classRequestDefinition from "../definitions/request.json"
import classRequestGrantDefinition from "../definitions/grant.json"
import profileDefinition from "../definitions/profile.json"
import classDefinition from "../definitions/class.json"
import mindMapDefinition from "../definitions/mindMap.json"
import datasetLinkDefinition from "../definitions/link.json"
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { CLASSES, CONTACTS, MESSAGES, PROFILE, REQUESTS, SLASH, TTLFILETYPE, WIKIMIND, getPodUrl } from "./containerService";
import { generate_uuidv4 } from "./utils";
import { Class } from "../models/types/Class";
import { ClassLDO } from "../models/things/ClassLDO";
// import { getProfile } from "./profileService";
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";
import { LinkType } from "../models/types/LinkType";
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
import { RequestLDO } from "../models/things/RequestLDO";
import { Grant } from "../models/types/Grant";
import { GrantLDO } from "../models/things/GrantLDO";
import { ChatLDO } from "../models/things/ChatLDO";
import { MindMap } from "../models/types/MindMap";
import { MindMapLDO } from "../models/things/MindMapLDO";

export async function getClassesList(userSession: UserSession) {
    const classes: Class[] = []
    const classesListUrl = `${userSession.podUrl}${WIKIMIND}/${CLASSES}/${CLASSES}${TTLFILETYPE}`;

    const myDataset = await getSolidDataset(
        classesListUrl,
        { fetch: fetch }
    );
    const things = await getThingAll(myDataset);
    const datasetLinkBuilder = new LinkLDO(datasetLinkDefinition)
    await Promise.all(things.map(async (thing) => {
        const types = getUrlAll(thing, RDF.type);
        if (types.some(type => type === datasetLinkDefinition.identity)) {
            const link = datasetLinkBuilder.read(thing)
            if (link.linkType === LinkType.CLASS_LINK) {
                const myDataset = await getSolidDataset(
                    link.url,
                    { fetch: fetch }
                );
                const things = await getThingAll(myDataset);
                const classBuilder = new ClassLDO(classDefinition)
                things.forEach(thing => {
                    const types = getUrlAll(thing, RDF.type);
                    if (types.some(type => type === classDefinition.identity)) {
                        let newClass = classBuilder.read(thing)
                        classes.push(newClass)
                    }
                });
            }
        }
    }));
    return classes;
}


/**
 * Creates a new class with the given name and user session.
 *
 * @param {string} name - The name of the class.
 * @param {UserSession} userSession - The user session.
 * @returns {Promise<string>} - A Promise that resolves with the URL of the created class.
 */
export async function createNewClass(name: string, userSession: UserSession): Promise<string> {
    const classesListUrl = `${userSession.podUrl}${WIKIMIND}/${CLASSES}/${CLASSES}${TTLFILETYPE}`;


    try {
        const profileUrl = `${userSession.podUrl}${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;
        return await this.profileRepository.getProfile(profileUrl);
      } catch (error) {
        console.error(error);
        return undefined;
      }onst classStorageUrl = `${userSession.podUrl}${WIKIMIND}/${CLASSES}/${generate_uuidv4()}${TTLFILETYPE}`;

    const blankClass: Class = {
        name: name,
        ownerPod: userSession.podUrl,
        id: generate_uuidv4(),
        teacher: userSession.webId,
        storage: classStorageUrl
    };
    const classUrl = `${userSession.podUrl}${WIKIMIND}/${CLASSES}/${blankClass.id}${TTLFILETYPE}`;

    const datasetLink: Link = {
        id: generate_uuidv4(),
        url: classUrl,
        linkType: LinkType.CLASS_LINK
    };

    const linkLDO = new LinkLDO(datasetLinkDefinition).create(datasetLink);

    let userClassesList = await getSolidDataset(classesListUrl, { fetch: fetch });
    userClassesList = setThing(userClassesList, linkLDO);

    let classDataset = createSolidDataset();
    const classLDO = new ClassLDO(classDefinition).create(blankClass);
    classDataset = setThing(classDataset, classLDO);

    await saveSolidDatasetAt(classesListUrl, userClassesList, { fetch: fetch });
    await saveSolidDatasetAt(classUrl, classDataset, { fetch: fetch });

    let classStorage = createSolidDataset();
    await saveSolidDatasetAt(classStorageUrl, classStorage, { fetch: fetch });


    if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
        initializeAcl(classUrl);
        initializeAcl(classStorageUrl);
    }

    return classUrl;
}

export async function getClass(url: string): Promise<ClassDataset | null> {
    const mindmapDataset = await getSolidDataset(url, { fetch });
    const mindMapThings = await getThingAll(mindmapDataset);

    const mindMapLDO = new ClassLDO(classDefinition);
    let classMeta: Class | null = null;

    mindMapThings.forEach((thing) => {
        const types = getUrlAll(thing, RDF.type);
        if (types.includes(classDefinition.identity)) {
            classMeta = mindMapLDO.read(thing);
        }
    });

    if (classMeta !== null) {
        classMeta = classMeta as Class;
        const classStorageDataset = await getSolidDataset(classMeta.storage, { fetch });
        const classStorageThings = await getThingAll(classStorageDataset);
        const mindmaps: MindMap[] = [];
        const mindmapLDO = new MindMapLDO(mindMapDefinition);
        const students: Profile[] = [];
        const profileLDO = new ProfileLDO(profileDefinition);
        const linkLDO = new LinkLDO(datasetLinkDefinition);
        const exams: Exam[] = [];
        const examLDO = new ExamLDO(examDefinition);

        await Promise.all(classStorageThings.map(async (thing) => {
            const types = getUrlAll(thing, RDF.type);
            if (types.some(type => type === datasetLinkDefinition.identity)) {
                const link = linkLDO.read(thing)
                if (link.linkType === LinkType.PROFILE_LINK) {
                    const podUrls = await getPodUrl(link.url)
                    if (podUrls !== null) {
                        const podUrl = podUrls[0]
                        // const userProfile = await getProfile(podUrls[0])
                        // if (userProfile) {
                        //     students.push(userProfile)
                        // }
                    }
                }
                if (link.linkType === LinkType.GRAPH_LINK) {
                    const myDataset = await getSolidDataset(
                        link.url,
                        { fetch: fetch }
                    );
                    const things = getThingAll(myDataset);
                    const mindMapBuilder = new MindMapLDO(mindMapDefinition)
                    things.forEach(thing => {
                        const types = getUrlAll(thing, RDF.type);
                        if (types.some(type => type === mindMapDefinition.identity)) {
                            mindmaps.push(mindMapBuilder.read(thing))
                        }
                    });
                }
            }
            if (types.some(type => type === examDefinition.identity)) {
                const exam = examLDO.read(thing)
                exams.push(exam)
            }
        }))
        const classDataset: ClassDataset = {
            id: classMeta.id,
            ownerPod: classMeta.ownerPod,
            name: classMeta.name,
            storage: classMeta.storage,
            teacher: classMeta.teacher,
            students: students,
            mindMaps: mindmaps,
            testResults: exams
        };
        return classDataset;
    } else {
        return null
    }
}



// export async function getClassDataset(classUrl: string) {
//     const myDataset = await getSolidDataset(
//         classUrl,
//         { fetch: fetch }
//     );
//     const things = await getThingAll(myDataset);
//     console.log(things)

//     let newClass: TeachClass | undefined
//     let classDataset: ClassDataset | undefined

//     const classBuilder = new ClassLDO(classDefinition)
//     const mindMaps: MindMapDataset[] = []
//     const exams: Exam[] = []
//     const examBuilder = new ExamLDO(examDefinition)
//     const profiles: Profile[] = []
//     const datasetLinkBuilder = new LinkLDO(datasetLinkDefinition)

//     await Promise.all(things.map(async (thing) => {
//         const types = getUrlAll(thing, RDF.type);
//         if (types.some(type => type === datasetLinkDefinition.identity)) {
//             const newLink = datasetLinkBuilder.read(thing)
//             if (newLink.linkType === LinkType.PROFILE_LINK) {

//                 getPodUrl(newLink.url).then(async (res) => {
//                     if (res) {
//                         const profileUrl = `${res[0]}${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;
//                         getProfile(profileUrl).then((userProfile) => {
//                             if (userProfile) {
//                                 profiles.push(userProfile)
//                             }
//                         })
//                     }
//                 })
//             }
//             if (newLink.linkType === LinkType.GRAPH_LINK) {
//                 const mindMap = await getMindMap(newLink.url)
//                 if (mindMap !== null) {
//                     mindMaps.push(mindMap)
//                 }
//             }
//         }
//         if (types.some(type => type === examDefinition.identity)) {
//             const exam = examBuilder.read(thing)
//         }
//         if (types.some(type => type === classDefinition.identity)) {
//             newClass = classBuilder.read(thing)
//         }
//     }))

//     if (newClass) {
//         const classDataset: ClassDataset = {
//             id: newClass.id,
//             name: newClass.name,
//             storage: newClass.storage,
//             teacher: newClass.teacher,
//             mindMaps: mindMaps,
//             students: profiles,
//             testResults: exams
//         }
//     }
//     return classDataset
// }

export async function allowAccess(userSession: UserSession, classRequest: Request) {
    const podUrls = await getPodUrl(classRequest.requestor)
    console.log(podUrls)
    if (podUrls !== null) {

        const classDataset = await getSolidDataset(
            classRequest.class,
            { fetch: fetch }
        );

        let classs: Class | undefined
        const things = await getThingAll(classDataset);
        const classBuilder = new ClassLDO(classDefinition)
        things.forEach(thing => {
            const types = getUrlAll(thing, RDF.type);
            if (types.some(type => type === classDefinition.identity)) {
                classs = classBuilder.read(thing)
            }
        });

        if (classs) {

            // VLOZIT ZAKA DO TRIDY
            const datasetLink: Link = {
                id: generate_uuidv4(),
                url: classRequest.requestor,
                linkType: LinkType.PROFILE_LINK
            }
            const classLDO = new LinkLDO(datasetLinkDefinition).create(datasetLink)
            let myDataset = await getSolidDataset(
                classs.storage,
                { fetch: fetch }
            );
            myDataset = setThing(myDataset, classLDO)
            await saveSolidDatasetAt(
                classs.storage,
                myDataset,
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

            universalAccess.setAgentAccess(
                classs.storage,
                classRequest.requestor,     // Agent
                { append: true, read: true, write: false },          // Access object
                { fetch: fetch }    // fetch function from authenticated session
            ).then((newAccess) => {
                console.log(newAccess)
            });

            // ODESLAT ZAKOVI POTVRZENI

            const newRequst = new GrantLDO(classRequestGrantDefinition).create({
                id: generate_uuidv4(),
                class: classRequest.class
            })

            let grantDataset = await getSolidDataset(
                podUrls[0] + WIKIMIND + SLASH + CLASSES + SLASH + REQUESTS + TTLFILETYPE,
                { fetch: fetch }
            );
            console.log(grantDataset)
            grantDataset = setThing(grantDataset, newRequst)
            await saveSolidDatasetAt(
                podUrls[0] + WIKIMIND + SLASH + CLASSES + SLASH + REQUESTS + TTLFILETYPE,
                grantDataset,
                { fetch: fetch }
            );

            // VYTVORIT CHAT

            const messageDatasetId = generate_uuidv4()
            const messageDatasetUrl = userSession.podUrl + WIKIMIND + SLASH + MESSAGES + SLASH + messageDatasetId + TTLFILETYPE
            const MessageStorageUrl = userSession.podUrl + WIKIMIND + SLASH + MESSAGES + SLASH + generate_uuidv4() + TTLFILETYPE

            const newChat = new ChatLDO(chatDefinition).create({
                id: messageDatasetId,
                host: userSession.webId,
                ownerPod: userSession.podUrl,
                guest: classRequest.requestor,
                modified: '19.6.2023',
                lastMessage: '',
                storage: MessageStorageUrl
            })

            let chatSolidDataset = createSolidDataset();

            chatSolidDataset = setThing(chatSolidDataset, newChat)
            await saveSolidDatasetAt(
                messageDatasetUrl,
                chatSolidDataset,
                { fetch: fetch }
            );

            const chatStorageSolidDataset = createSolidDataset();
            await saveSolidDatasetAt(
                MessageStorageUrl,
                chatStorageSolidDataset,
                { fetch: fetch }
            );

            if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
                await initializeAcl(messageDatasetUrl)
                await initializeAcl(MessageStorageUrl)
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
            universalAccess.setAgentAccess(
                MessageStorageUrl,
                classRequest.requestor,
                { append: true, read: true, write: false },
                { fetch: fetch }
            ).then((newAccess) => {
                console.log(newAccess)
            });


            // VYTVORIT CHAT LINK

            const newChatLink = new LinkLDO(datasetLinkDefinition).create({
                id: generate_uuidv4(),
                linkType: LinkType.CHAT_LINK,
                url: messageDatasetUrl
            })


            // ULOZIT CHAT UCITELI DO KONTAKTU

            let myContactsDataset = await getSolidDataset(
                userSession.podUrl + WIKIMIND + SLASH + MESSAGES + SLASH + CONTACTS + TTLFILETYPE,
                { fetch: fetch }
            );

            myContactsDataset = setThing(myContactsDataset, newChatLink)
            await saveSolidDatasetAt(
                userSession.podUrl + WIKIMIND + SLASH + MESSAGES + SLASH + CONTACTS + TTLFILETYPE,
                myContactsDataset,
                { fetch: fetch }
            );


            // ULOZIT CHAT ZAKOVI DO KONTAKTU

            let studentsContactsDataset = await getSolidDataset(
                podUrls[0] + WIKIMIND + SLASH + MESSAGES + SLASH + CONTACTS + TTLFILETYPE,
                { fetch: fetch }
            );

            studentsContactsDataset = setThing(studentsContactsDataset, newChatLink)
            await saveSolidDatasetAt(
                podUrls[0] + WIKIMIND + SLASH + MESSAGES + SLASH + CONTACTS + TTLFILETYPE,
                studentsContactsDataset,
                { fetch: fetch }
            );
        }

    }
}

export async function denyRequest(userSession: UserSession, classRequest: Request) {
    console.log("aa")
}

export async function getRequests(userSession: UserSession) {
    let myDataset = await getSolidDataset(
        userSession.podUrl + WIKIMIND + SLASH + CLASSES + SLASH + REQUESTS + TTLFILETYPE,
        { fetch: fetch }          // fetch from authenticated session
    );
    const resourceUrls = await getContainedResourceUrlAll(myDataset);
    console.log(resourceUrls)
    const array: Request[] = []

    const things = await getThingAll(myDataset);

    const classRequestLDO = new RequestLDO(classRequestDefinition)
    const classRequestGrantLDO = new GrantLDO(classRequestGrantDefinition)
    const classRequests: Request[] = []
    const classRequestGrants: Grant[] = []

    things.forEach(thing => {
        const types = getUrlAll(thing, RDF.type);
        console.log(types)
        if (types.some(type => type === classRequestDefinition.identity)) {
            classRequests.push(classRequestLDO.read(thing))
        }
        if (types.some(type => type === classRequestGrantDefinition.identity)) {
            classRequestGrants.push(classRequestGrantLDO.read(thing))
            myDataset = removeThing(myDataset, thing)
        }
    });

    await saveSolidDatasetAt(
        userSession.podUrl + WIKIMIND + SLASH + CLASSES + SLASH + REQUESTS + TTLFILETYPE,
        myDataset,
        { fetch: fetch }
    );

    await Promise.all(classRequestGrants.map(async (item) => {
        const datasetLink: Link = {
            id: generate_uuidv4(),
            url: item.class,
            linkType: LinkType.CLASS_LINK
        }
        const classLDO = new LinkLDO(datasetLinkDefinition).create(datasetLink)
        const myDataset = await getSolidDataset(
            userSession.podUrl + WIKIMIND + SLASH + CLASSES + SLASH + CLASSES + TTLFILETYPE,
            { fetch: fetch }
        );
        const newDAtaset = setThing(myDataset, classLDO)
        await saveSolidDatasetAt(
            userSession.podUrl + WIKIMIND + SLASH + CLASSES + SLASH + CLASSES + TTLFILETYPE,
            newDAtaset,
            { fetch: fetch }
        );
    }))
    return classRequests
}

export async function requestClass(userSession: UserSession, classUri: string) {
    const paramString = classUri.split('?')[1];
    const webId = classUri.split('?')[0];
    const urlParams = new URLSearchParams(paramString);
    const classId = (urlParams.get("classId"))

    const podUrls = await getPodUrl(webId)
    console.log(podUrls)
    if (podUrls !== null) {
        const dataUrl = podUrls[0] + WIKIMIND + SLASH + CLASSES + SLASH + classId + TTLFILETYPE
        console.log(dataUrl)

        const newRequst = new RequestLDO(classRequestDefinition).create({
            id: generate_uuidv4(),
            class: dataUrl,
            requestor: userSession.webId
        })

        universalAccess.setAgentAccess(
            userSession.podUrl + WIKIMIND + SLASH + MESSAGES + SLASH + CONTACTS + TTLFILETYPE,
            webId,     // Agent
            { append: true, read: true, write: false },          // Access object
            { fetch: fetch }    // fetch function from authenticated session
        ).then((newAccess) => {
            console.log('setted new acces')
        });

        const myContactsDataset = await getSolidDataset(
            podUrls[0] + WIKIMIND + SLASH + CLASSES + SLASH + REQUESTS + TTLFILETYPE,
            { fetch: fetch }
        );
        console.log(myContactsDataset)
        const newProfileThing = setThing(myContactsDataset, newRequst)
        const savedProfileDatatset = await saveSolidDatasetAt(
            podUrls[0] + WIKIMIND + SLASH + CLASSES + SLASH + REQUESTS + TTLFILETYPE,
            newProfileThing,
            { fetch: fetch }
        );
    }
}



export async function addGraphToClass(userSession: UserSession, graphUrl: string, classUrl: string) {

    const clasDataset = await getSolidDataset(classUrl, { fetch });
    const classThings = await getThingAll(clasDataset);

    const cclassO = new ClassLDO(classDefinition);
    let classMeta: Class | null = null;

    classThings.forEach((thing) => {
        const types = getUrlAll(thing, RDF.type);
        if (types.includes(classDefinition.identity)) {
            classMeta = cclassO.read(thing);
        }
    });

    if (classMeta !== null) {
        classMeta = classMeta as Class;
        let classStorageDataset = await getSolidDataset(classMeta.storage, { fetch });

        const datasetLink: Link = {
            id: generate_uuidv4(),
            url: graphUrl,
            linkType: LinkType.GRAPH_LINK
        }
        const classLDO = new LinkLDO(datasetLinkDefinition).create(datasetLink)
        classStorageDataset = setThing(classStorageDataset, classLDO)
        const savedSolidDatasetContainer = await saveSolidDatasetAt(
            classMeta.storage,
            classStorageDataset,
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
}
