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
    getFile,
    setUrl,
    getThingAll,
    getSolidDatasetWithAcl,
    createContainerAt,
    getStringNoLocale,
    getUrlAll,
    getUrl,
    getAgentAccessAll,
    saveFileInContainer, getSourceUrl,
    universalAccess,
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
import datasetLinkDefinition from "../definitions/datasetLink.json"
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
import { DatasetLink } from "../models/types/DatasetLink";
import { DatasetLinkLDO } from "../models/things/DatasetLinkLDO";
import { LinkType } from "../models/types/LinkType";
import { AccessRequest, issueAccessRequest, redirectToAccessManagementUi } from "@inrupt/solid-client-access-grants";
import { UserData } from "../sessionContext";

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

        const podUrl = podUrls[0] + 'Wikie/classes/classes.ttl'

        let myDataset = await getSolidDataset(
            podUrl,
            { fetch: fetch }
        );


        const teacherProfile = await getProfile(sessionId)
        const teacherName = teacherProfile?.name + ' ' + teacherProfile?.surname
        const blankClass: TeachClass = {
            name: name,
            id: generate_uuidv4(),
            teacher: teacherName,
            storage: podUrls[0]
        }

        const datasetLink: DatasetLink = {
            id: blankClass.id,
            url: podUrls[0],
            linkType: LinkType.CLASS_LINK
        }

        const classLDO = new DatasetLinkLDO(datasetLinkDefinition).create(datasetLink)
        myDataset = setThing(myDataset, classLDO)
        let newName = podUrl + "Wikie/classes/" + "classes" + ".ttl"

        let courseSolidDataset = createSolidDataset();
        const classDataset = new ClassLDO(classDefinition).create(blankClass)
        courseSolidDataset = setThing(courseSolidDataset, classDataset)
        let newClassDataset = podUrls[0] + "Wikie/classes/" + blankClass.id + ".ttl"

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

export async function getClassDataset(cnt: UserData, url: string) {
    console.log(url)

    // ExamplePrinter sets the requested access (if granted) to expire in 5 minutes.
    let accessExpiration = new Date(Date.now() + 50 * 60000);

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
        "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/classes/classes.ttl",
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
        "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/classes/classes.ttl",
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


    // const requestVC = await issueAccessRequest(
    //     {
    //         "access": { read: true },
    //         "resources": ["https://storage.inrupt.com/7dacd025-b698-49fc-b6ec-d75ee58ff387/Wikie/classes/a16fd524-88eb-4951-bc57-b8652d2f0294.ttl"],   // Array of URLs
    //         "resourceOwner": "https://id.inrupt.com/matejikj",
    //         "expirationDate": accessExpiration,
    //         "purpose": ["https://example.com/purposes#print"]
    //     },
    //     { fetch: fetch } // From the requestor's (i.e., ExamplePrinter's) authenticated session
    // );

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


export async function getClassesList(url: string) {
    console.log(url)
    let classes: DatasetLink[] = []
    const podUrls = await getPodUrl(url)
    console.log(podUrls)
    console.log(fetch)
    if (podUrls !== null) {
        const podUrl = podUrls[0] + 'Wikie/classes/classes.ttl'

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

    }
    return classes;

}