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
    getFile,getProfileAll,
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
    Thing,
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
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";
import { MindMap } from "../models/types/MindMap";
import { getPodUrl } from "./containerService";
import { generate_uuidv4 } from "./utils";
import { Class as TeachClass } from "../models/types/Class";
import { ClassLDO } from "../models/things/ClassLDO";
import { getProfile } from "./profileService";
import { DatasetLink } from "../models/types/DatasetLink";
import { DatasetLinkLDO } from "../models/things/DatasetLinkLDO";
import { LinkType } from "../models/types/LinkType";
import { AccessRequest, issueAccessRequest, redirectToAccessManagementUi } from "@inrupt/solid-client-access-grants";
import { UserSession } from "../models/types/UserSession";
import { ClassDataset } from "../models/types/ClassDataset";
import { Exam } from "../models/types/Exam";
import { Profile } from "../models/types/Profile";
import { ExamLDO } from "../models/things/ExamLDO";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { ClassRequest } from "../models/types/ClassRequest";

export async function createNewClass(name: string, userSession: UserSession) {
    const podUrl = userSession.podUrl + 'Wikie/classes/classes.ttl'
    const teacherProfile = await getProfile(userSession)
    const blankClass: TeachClass = {
        name: name,
        id: generate_uuidv4(),
        teacher: userSession.webId,
        storage: userSession.podUrl
    }

    const datasetLink: DatasetLink = {
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
    return newName

}

export async function addClass(name: string, userSession: UserSession) {
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
            pupils: profiles,
            testResults: exams
        }
        return classDataset
    } else {
        return null
    }
}

export async function aaaa() {
    const newProfileLink = new DatasetLinkLDO(datasetLinkDefinition).create({
        id: generate_uuidv4(),
        linkType: LinkType.PROFILE_LINK,
        url: "https://id.inrupt.com/matejikj"
      })
  
      let myContactsDataset = await getSolidDataset(
        "https://storage.inrupt.com/7dacd025-b698-49fc-b6ec-d75ee58ff387/Wikie/messages/contacts.ttl",
        { fetch: fetch }
      );
      
    //   const newProfileLink = new DatasetLinkLDO(datasetLinkDefinition).read()

      const newProfileThing = setThing(myContactsDataset, newProfileLink)

      const savedProfileDatatset = await saveSolidDatasetAt(
        "https://storage.inrupt.com/7dacd025-b698-49fc-b6ec-d75ee58ff387/Wikie/messages/contacts.ttl",
        newProfileThing,
        { fetch: fetch }
      );
      console.log(myContactsDataset)
      console.log("AAAAAAAAAAAAA")
}

export async function aaaaaa(userSession: UserSession, classPodUrl: string) {

    console.log(classPodUrl)

    // ExamplePrinter sets the requested access (if granted) to expire in 5 minutes.
    // let accessExpiration = new Date(Date.now() + 50 * 60000);

    // Call `issueAccessRequest` to create an access request
    //
    // const requestVC = await issueAccessRequest(
    //     {
    //         "access": { read: true },
    //         "resources": ["https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/Screenshot%20from%202023-05-10%2000-02-04.png"],   // Array of URLs
    //         "resourceOwner": "https://id.inrupt.com/matejikj",
    //         "expirationDate": accessExpiration,
    //         "purpose": ["https://example.com/purposes#print"]
    //     },
    //     cnt.sess
    //     // { fetch: fetch } // From the requestor's (i.e., ExamplePrinter's) authenticated session
    // );

    // const aa = (JSON.stringify(requestVC))
    // const obj = JSON.parse(aa) as AccessRequest
    // console.log(obj)
    // redirectToAccessManagementUi(
    //     obj.id,
    //     window.location.href,
    //     {
    //       fallbackAccessManagementUi: "https://podbrowser.inrupt.com/privacy/access/requests/"
    //     }
    //  );

    // const podUrl = url[0] + 'Wikie/classes/classes.ttl'


    let myDataset = await getSolidDataset(
        userSession.podUrl + "Wikie/classes/classes.ttl",
        { fetch: fetch }
    );
    console.log(myDataset)

    const node: Node = {
        cx: 5,
        cy: 5,
        id: "43",
        title: "AAAA",
        description: "farwetgey hf ",
        visible: false
    }
    let nodeBuilder = new NodeLDO((nodeDefinition as LDO<Node>))
    // // let thingUrl = "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/ahojda.ttl#44274717-8e40-41d3-a372-94d85bd5e686"
    // console.log(thingUrl)
    //     let book1Thing = await getThing(courseSolidDataset, thingUrl);
    //     if (book1Thing !== null){
    //       console.log(nodeBuilder.read(book1Thing))
    //       console.log(getStringNoLocale(book1Thing, 'http://schema.org/identifier'))
    //     }
    let courseSolidDataset = setThing(myDataset, nodeBuilder.create(node));



    // console.log(nodeBuilder.read(book1Thing))

    // let book1Thing = getThing(courseSolidDataset, `${resourceURL}#${}`);
    // book1Thing = buildThing(book1Thing)
    //   .addInteger("https://schema.org/numberOfPages", 30)
    //   .build();

    // courseSolidDataset = setThing(courseSolidDataset, nodeBuilder.create(node));

    const savedSolidDataset = await saveSolidDatasetAt(
        userSession.podUrl + "Wikie/classes/classes.ttl",
        courseSolidDataset,
        { fetch: fetch }
    );

    console.log(savedSolidDataset)

    // function logAccessInfo(agent: any, agentAccess: any, resource: any) {
    //     console.log(`For resource::: ${resource}`);
    //     if (agentAccess === null) {
    //         console.log(`Could not load ${agent}'s access details.`);
    //     } else {
    //         console.log(`${agent}'s Access:: ${JSON.stringify(agentAccess)}`);
    //     }
    // }

    // universalAccess.getAclServerResourceInfo(myDataset,   // Resource
    //     { fetch: fetch }                  // fetch function from authenticated session
    // ).then((res => {
    //     console.log(res)
    // }))

    // universalAccess.getAgentAccessAll(
    //     "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/classes/classes.ttl",   // Resource
    //     { fetch: fetch }                  // fetch function from authenticated session
    // ).then((returnedAccess) => {
    //     if (returnedAccess === null) {
    //         console.log("Could not load access details for this Resource.");
    //     } else {
    //         console.log((returnedAccess));
    //     }
    // });
    // universalAccess.getAgentAccessAll(
    //     "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/ahojda.ttl",   // Resource
    //     { fetch: fetch }                  // fetch function from authenticated session
    // ).then((returnedAccess) => {
    //     if (returnedAccess === null) {
    //         console.log("Could not load access details for this Resource.");
    //     } else {
    //         console.log((returnedAccess));
    //     }
    // });




    // universalAccess.setAgentAccess(
    //     "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/classes/classes.ttl",         // Resource
    //     "http://www.w3.org/ns/solid/acp#AuthenticatedAgent",     // Agent
    //     { append: true, read: true, write: false },          // Access object
    //     { fetch: fetch }                         // fetch function from authenticated session
    //   ).then((newAccess) => {
    //     console.log(newAccess)
    //   });

    // universalAccess.getPublicAccess(
    //     "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/classes/classes.ttl",   // Resource
    //     { fetch: fetch }                  // fetch function from authenticated session
    // ).then((returnedAccess) => {
    //     if (returnedAccess === null) {
    //         console.log("Could not load access details for this Resource.");
    //     } else {
    //         console.log("Returned Public Access:: ", JSON.stringify(returnedAccess));
    //     }
    // });

    // https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/ahojda.ttl

    // universalAccess.getAgentAccess(
    //     "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/Screenshot%20from%202023-05-10%2000-02-04.png",       // resource  
    //     "https://id.inrupt.com/matejikj",   // agent
    //     { fetch: fetch }                      // fetch function from authenticated session
    //   ).then((agentAccess) => {
    //     logAccessInfo("", agentAccess, "https://example.com/resource");
    //   });

    let accessExpiration = new Date(Date.now() + 60 * 60 * 60 * 60000);

    const requestVC = await issueAccessRequest(
        {
            "access": { read: true },
            "resources": ["https://storage.inrupt.com/7dacd025-b698-49fc-b6ec-d75ee58ff387/Wikie/classes/a16fd524-88eb-4951-bc57-b8652d2f0294.ttl"],   // Array of URLs
            "resourceOwner": "https://id.inrupt.com/matejikj",
            "expirationDate": accessExpiration,
            "purpose": ["https://example.com/purposes#print"]
        },
        { fetch: fetch } // From the requestor's (i.e., ExamplePrinter's) authenticated session
    );

    // const aa = JSON.stringify(requestVC)
    // const file = new Blob([aa], { type: 'text/plain' })
    // console.log(file)
    // const savedFile = await saveFileInContainer(
    //     "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/classes/requests/",           // Container URL
    //     file,                         // File 
    //     { slug: "matejikj.json", contentType: file.type, fetch: fetch }
    //   );

    // const file = await getFile(
    //     "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/classes/requests/matejikj.json",               // File in Pod to Read
    //     { fetch: fetch }       // fetch from authenticated session
    // );

    // console.log(file)



    // await redirectToAccessManagementUi(
    //     requestVC.id,
    //     window.location.href
    // );



    // let classes: DatasetLink[] = []
    // // const podUrls = await getPodUrl(url)
    // // console.log(podUrls)
    // // console.log(podUrls)
    // const myDataset = await getSolidDataset(
    //     url,
    //     { fetch: fetch }
    // );
    // console.log(myDataset)
    // if (podUrls !== null) {

    // const myDataset = await getSolidDataset(
    //     url,
    //     { fetch: fetch }
    // );
    // console.log(myDataset)

    // const things = await getThingAll(myDataset);
    // console.log(things)


    // let datasetLinkBuilder = new DatasetLinkLDO(datasetLinkDefinition)

    // things.forEach(thing => {
    //     const types = getUrlAll(thing, RDF.type);
    //     if (types.some(type => type === datasetLinkDefinition.identity.subject)) {
    //         const link = datasetLinkBuilder.read(thing)
    //         if (link.linkType === LinkType.CLASS_LINK){
    //             classes.push(link)
    //         }
    //     }
    // });

    // console.log(classes)

    // }
    // return classes;

}

export async function allowAccess(userSession: UserSession, classRequest: ClassRequest) {
    const accessGrant = await approveAccessRequest(
        classRequest.accessRequest,
        undefined,  // Optional modifications
        {
            fetch: fetch, // From the resource owner's (i.e., snoringsue's) authenticated session
        }
    );

    const podUrls = await getPodUrl(accessGrant.credentialSubject.providedConsent.isProvidedTo)
    console.log(podUrls)
    if (podUrls !== null) {
        const dataUrl = podUrls[0] + "Wikie/classes/requests/"

        const cc = JSON.stringify(accessGrant)
        const file = new Blob([cc], { type: 'text/plain' })
        console.log(file)
        const naame = generate_uuidv4() + ".json"
        const savedFile = await saveFileInContainer(
            dataUrl,           // Container URL
            file,                         // File 
            { slug: naame, contentType: file.type, fetch: fetch }
        );

        const datasetLink: DatasetLink = {
            id: generate_uuidv4(),
            url: accessGrant.credentialSubject.providedConsent.isProvidedTo,
            linkType: LinkType.PROFILE_LINK
        }
        const classLDO = new DatasetLinkLDO(datasetLinkDefinition).create(datasetLink)
        let myDataset = await getSolidDataset(
            accessGrant.credentialSubject.providedConsent.forPersonalData[0],
            { fetch: fetch }
        );
        const newDAtaset = setThing(myDataset, classLDO)
        const savedSolidDatasetContainer = await saveSolidDatasetAt(
            accessGrant.credentialSubject.providedConsent.forPersonalData[0],
            newDAtaset,
            { fetch: fetch }
        );

        universalAccess.setAgentAccess(
            accessGrant.credentialSubject.providedConsent.forPersonalData[0],
            accessGrant.credentialSubject.providedConsent.isProvidedTo,     // Agent
            { append: true, read: true, write: false },          // Access object
            { fetch: fetch }    // fetch function from authenticated session
        ).then((newAccess) => {
            console.log(newAccess)
        });

        let courseSolidDataset = createSolidDataset();


        let messageDatasetUrl = userSession.podUrl + "Wikie/messages/" + encodeURIComponent(accessGrant.credentialSubject.providedConsent.isProvidedTo) + ".ttl"
        
        const messageDataset = await saveSolidDatasetAt(
            messageDatasetUrl,
            courseSolidDataset,
            { fetch: fetch }
        );
    

        universalAccess.setAgentAccess(
            messageDatasetUrl,
            accessGrant.credentialSubject.providedConsent.isProvidedTo,     // Agent
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

        // const newProfilePupilLink = new DatasetLinkLDO(datasetLinkDefinition).create({
        //     id: generate_uuidv4(),
        //     linkType: LinkType.PROFILE_LINK,
        //     url: accessGrant.credentialSubject.providedConsent.isProvidedTo
        // })

        // let myPupilContactsDataset = await getSolidDataset(
        //     userSession.podUrl + "Wikie/messages/contacts.ttl",
        //     { fetch: fetch }
        // );
        // console.log(myPupilContactsDataset)
        // const newPupilProfileThing = setThing(myPupilContactsDataset, newProfilePupilLink)
        // const savedPupilProfileDatatset = await saveSolidDatasetAt(
        //     userSession.podUrl + "Wikie/messages/contacts.ttl",
        //     newPupilProfileThing,
        //     { fetch: fetch }
        // );

        // console.log(savedPupilProfileDatatset)
    }

    console.log(accessGrant)
    await deleteFile(
        classRequest.requestFile,  // File to delete
        { fetch: fetch }                         // fetch function from authenticated session
    );

}

export async function denyRequest(userSession: UserSession, classRequest: ClassRequest) {

    const accessGrant = await denyAccessRequest(
        classRequest.accessRequest,
        {
            fetch: fetch, // From the resource owner's (i.e., snoringsue's) authenticated session
        }
    );
    await deleteFile(
        classRequest.requestFile,  // File to delete
        { fetch: fetch }                         // fetch function from authenticated session
    );

}

export async function getRequests(userSession: UserSession) {
    const myDataset = await getSolidDataset(
        userSession.podUrl + "Wikie/classes/requests",
        { fetch: fetch }          // fetch from authenticated session
    );

    const resourceUrls = await getContainedResourceUrlAll(myDataset);
    console.log(resourceUrls)
    const array: ClassRequest[] = []

    await Promise.all(resourceUrls.map(async (item) => {
        const file = await getFile(item, { fetch: fetch })
        let fileText = await file.text()
        let credentialObject = JSON.parse(fileText)
        let objectTypes = credentialObject.type as string[]
        if (objectTypes.includes("SolidAccessRequest")) {
            const accessRequest = credentialObject as AccessRequest
            const classUrl = accessRequest.credentialSubject.hasConsent.forPersonalData[0]
            const id = accessRequest.credentialSubject.hasConsent.forPersonalData[0].split('Wikie/classes/')[1]
            const myDataset = await getSolidDataset(
                classUrl,
                { fetch: fetch }          // fetch from authenticated session
            )
            const classThing = await getThing(myDataset, classUrl + "#" + id.split(".ttl")[0])
            let classBuilder = new ClassLDO(classDefinition)
            if (classThing !== null) {
                const classObject = classBuilder.read(classThing)
                array.push({
                    accessRequest: accessRequest,
                    className: classObject.name,
                    requestFile: item
                })
            }
        }
        if (objectTypes.includes("SolidAccessGrant")) {
            const accessGrant = credentialObject as AccessGrant
            // console.log(accessGrant)

            const datasetLink: DatasetLink = {
                id: generate_uuidv4(),
                url: accessGrant.credentialSubject.providedConsent.forPersonalData[0],
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
        }

        // const accessGrant = await approveAccessRequest(
        //     ii,
        //     undefined,  // Optional modifications
        //     {
        //         fetch: fetch, // From the resource owner's (i.e., snoringsue's) authenticated session
        //     }
        // );

    }))

    console.log(array)
    return array
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

        let accessExpiration = new Date(Date.now() + 60 * 60 * 60 * 60000);
        const requestVC = await issueAccessRequest(
            {
                "access": { read: true },
                "resources": [dataUrl],   // Array of URLs
                "resourceOwner": webId,
                "expirationDate": accessExpiration,
                "purpose": ["https://example.com/purposes#print"]
            },
            { fetch: fetch } // From the requestor's (i.e., ExamplePrinter's) authenticated session
        );
        console.log(requestVC)
        const cc = JSON.stringify(requestVC)
        const dd = podUrls[0] + "Wikie/classes/requests/"
        const file = new Blob([cc], { type: 'text/plain' })
        console.log(file)
        const naame = generate_uuidv4() + ".json"
        const savedFile = await saveFileInContainer(
            dd,           // Container URL
            file,                         // File 
            { slug: naame, contentType: file.type, fetch: fetch }
        );

    }


}


export async function getClassesList(userSession: UserSession) {
    let classes: DatasetLink[] = []
    const podUrl = userSession.podUrl + 'Wikie/classes/classes.ttl'

    const myDataset = await getSolidDataset(
        podUrl,
        getDefaultSession()
    );

    const things = await getThingAll(myDataset);
    console.log(things)


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
    console.log(classes)

    return classes;


}