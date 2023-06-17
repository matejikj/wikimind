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
import { Class as TeachClass } from "../models/types/Class";
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
                console.log(newLink)
                console.log("newLink")
                const pupilProfiles = await getProfileAll(newLink.url, { fetch });

                console.log(pupilProfiles)
                let myExtendedProfile = pupilProfiles.altProfileAll[0];

                const profile = await getWebIdDataset(newLink.url);
                const podRoot = getPodUrlAllFrom({ webIdProfile: profile, altProfileAll: [] }, newLink.url);


                const podUrls = await getPodUrl(newLink.url)
                if (podUrls !== null) {
                    const podUrl = podUrls[0]
                    let bb = getThing(myExtendedProfile, podUrl + "profile#Wikie");
                    let profileBuilder = new ProfileLDO((profileDefinition as LDO<Profile>))
                    let userProfile = profileBuilder.read(bb)
                    console.log(userProfile)
                    profiles.push(userProfile)
                }
            }
            if (newLink.linkType === LinkType.GRAPH_LINK) {
                const a = await getMindMap(newLink.url)
                if (a !== null) {
                    a.url = newLink.url
                    mindMaps.push(a)
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
    // const accessGrant = await approveAccessRequest(
    //     classRequest.accessRequest,
    //     undefined,  // Optional modifications
    //     {
    //         fetch: fetch, // From the resource owner's (i.e., snoringsue's) authenticated session
    //     }
    // );

    const podUrls = await getPodUrl(classRequest.requestor)
    console.log(podUrls)
    if (podUrls !== null) {
        const dataUrl = podUrls[0] + "Wikie/classes/requests.ttl"

        //     const cc = JSON.stringify(accessGrant)
        //     const file = new Blob([cc], { type: 'text/plain' })
        //     console.log(file)
        //     const naame = generate_uuidv4() + ".json"
        //     const savedFile = await saveFileInContainer(
        //         dataUrl,           // Container URL
        //         file,                         // File 
        //         { slug: naame, contentType: file.type, fetch: fetch }
        //     );

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

        const newRequst = new ClassRequestGrantLDO(classRequestGrantDefinition).create({
            id: generate_uuidv4(),
            class: classRequest.class
        })

        console.log(podUrls[0] + "Wikie/classes/requests.ttl")

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



        let courseSolidDataset = createSolidDataset();


        let messageDatasetUrl = userSession.podUrl + "Wikie/messages/" + encodeURIComponent(classRequest.requestor) + ".ttl"

        const messageDataset = await saveSolidDatasetAt(
            messageDatasetUrl,
            courseSolidDataset,
            { fetch: fetch }
        );

        if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
            await initializeAcl(messageDatasetUrl)
        }

        universalAccess.setAgentAccess(
            messageDatasetUrl,
            classRequest.requestor,     // Agent
            { append: true, read: true, write: false },          // Access object
            { fetch: fetch }    // fetch function from authenticated session
        ).then((newAccess) => {
            console.log(newAccess)
        });

        const newProfileLink = new DatasetLinkLDO(datasetLinkDefinition).create({
            id: generate_uuidv4(),
            linkType: LinkType.PROFILE_LINK,
            url: userSession.webId
        })

        console.log(podUrls[0] + "Wikie/messages/contacts.ttl")

        let myContactsDataset = await getSolidDataset(
            podUrls[0] + "Wikie/messages/contacts.ttl",
            { fetch: fetch }
        );
        console.log(myContactsDataset)
        const newProfileThing = setThing(myContactsDataset, newProfileLink)
        const savedProfileDatatset = await saveSolidDatasetAt(
            podUrls[0] + "Wikie/messages/contacts.ttl",
            newProfileThing,
            { fetch: fetch }
        );
    }
    // console.log(accessGrant)
    // await deleteFile(
    //     classRequest.requestFile,  // File to delete
    //     { fetch: fetch }                         // fetch function from authenticated session
    // );
}

export async function denyRequest(userSession: UserSession, classRequest: Request) {
    // const accessGrant = await denyAccessRequest(
    //     classRequest.accessRequest,
    //     {
    //         fetch: fetch, // From the resource owner's (i.e., snoringsue's) authenticated session
    //     }
    // );
    // await deleteFile(
    //     classRequest.requestFile,  // File to delete
    //     { fetch: fetch }                         // fetch function from authenticated session
    // );
}

export async function getRequests(userSession: UserSession) {
    const myDataset = await getSolidDataset(
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
        }
    });

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
    // await Promise.all(resourceUrls.map(async (item) => {
    //     const file = await getFile(item, { fetch: fetch })
    //     let fileText = await file.text()
    //     let credentialObject = JSON.parse(fileText)
    //     let objectTypes = credentialObject.type as string[]
    //     if (objectTypes.includes("SolidAccessRequest")) {
    //         const accessRequest = credentialObject as AccessRequest
    //         const classUrl = accessRequest.credentialSubject.hasConsent.forPersonalData[0]
    //         const id = accessRequest.credentialSubject.hasConsent.forPersonalData[0].split('Wikie/classes/')[1]
    //         const myDataset = await getSolidDataset(
    //             classUrl,
    //             { fetch: fetch }          // fetch from authenticated session
    //         )
    //         const classThing = await getThing(myDataset, classUrl + "#" + id.split(".ttl")[0])
    //         let classBuilder = new ClassLDO(classDefinition)
    //         if (classThing !== null) {
    //             const classObject = classBuilder.read(classThing)
    //             array.push({
    //                 accessRequest: accessRequest,
    //                 className: classObject.name,
    //                 requestFile: item
    //             })
    //         }
    //     }
    //     if (objectTypes.includes("SolidAccessGrant")) {
    //         const accessGrant = credentialObject as AccessGrant
    //         // console.log(accessGrant)

    //     }
    // }))
    return classRequests
}

// https://id.inrupt.com/matejikj?classId=d91f706d-ca0c-41aa-844b-cf47d1ef4c40


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


        // let accessExpiration = new Date(Date.now() + 60 * 60 * 60 * 60000);
        // const requestVC = await issueAccessRequest(
        //     {
        //         "access": { read: true },
        //         "resources": [dataUrl],   // Array of URLs
        //         "resourceOwner": webId,
        //         "expirationDate": accessExpiration,
        //         "purpose": ["https://example.com/purposes#print"]
        //     },
        //     { fetch: fetch } // From the requestor's (i.e., ExamplePrinter's) authenticated session
        // );
        // console.log(requestVC)
        // const cc = JSON.stringify(requestVC)
        // const dd = podUrls[0] + "Wikie/classes/requests/"
        // const file = new Blob([cc], { type: 'text/plain' })
        // console.log(file)
        // const naame = generate_uuidv4() + ".json"
        // const savedFile = await saveFileInContainer(
        //     dd,           // Container URL
        //     file,                         // File 
        //     { slug: naame, contentType: file.type, fetch: fetch }
        // );
    }
}


export async function getClassesList(userSession: UserSession) {
    let classes: Link[] = []
    const podUrl = userSession.podUrl + 'Wikie/classes/classes.ttl'

    const myDataset = await getSolidDataset(
        podUrl,
        { fetch: fetch }
    );
    const things = await getThingAll(myDataset);
    let datasetLinkBuilder = new DatasetLinkLDO(datasetLinkDefinition)
    things.forEach(thing => {
        const types = getUrlAll(thing, RDF.type);
        if (types.some(type => type === datasetLinkDefinition.identity.subject)) {
            const link = datasetLinkBuilder.read(thing)
            if (link.linkType === LinkType.CLASS_LINK) {
                classes.push(link)
            }
        }
    });
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