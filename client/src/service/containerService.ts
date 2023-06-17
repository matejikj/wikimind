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
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { NodeLDO } from "../models/things/NodeLDO";
import { Connection } from "../models/types/Connection";
import { LinkLDO } from "../models/things/LinkLDO";
import { MindMap } from "../models/types/MindMap";
import { UserSession } from "../models/types/UserSession";
import { initializeAcl, isWacOrAcp } from "./accessService";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";
import { getProfile } from "./profileService";

function logAccessInfo(agent: any, agentAccess: any, resource: any) {
  console.log(`For resource::: ${resource}`);
  if (agentAccess === null) {
    console.log(`Could not load ${agent}'s access details.`);
  } else {
    console.log(`${agent}'s Access:: ${JSON.stringify(agentAccess)}`);
  }
}

/**
 * 
 * Checks whether a given URL represents a container.
 * @param url The URL to check.
 * @returns A Promise resolving to a boolean indicating whether the URL represents a container.
*/
export async function isUrlContainer(url: string) {
  try {
    return await isContainer(await getSolidDataset(url, { fetch: fetch }))
  } catch (error) {
    console.log()
  }
}

/**
 * 
 * Retrieves the URL of the Solid POD of a user with a given session ID.
 * @param sessionId The session ID of the user.
 * @returns A Promise resolving to an array containing the POD URL(s) of the user, or null if no URL could be retrieved.
*/
export async function getPodUrl(sessionId: string) {
  try {
    return await getPodUrlAll(sessionId)
  } catch (error) {
    return null
  }
}

export async function checkContainer(sessionId: string): Promise<{podUrl: string,
  accessControlPolicy: AccessControlPolicy}> {
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
  
    if (!(await isUrlContainer(podUrl + 'Wikie/mindMaps'))) {
      const cont = await createContainerAt(podUrl + 'Wikie/mindMaps', { fetch: fetch });
    }
    if (!(await isUrlContainer(podUrl + 'Wikie/classes'))) {
      const classes = await createContainerAt(podUrl + 'Wikie/classes', { fetch: fetch });
      let classesDataset = createSolidDataset();
      const savedSolidDatasetContainer = await saveSolidDatasetAt(
        podUrl + 'Wikie/classes/classes.ttl',
        classesDataset,
        { fetch: fetch }
      );
      let reqeustsDataset = createSolidDataset();
      const savedSolidDataset = await saveSolidDatasetAt(
        podUrl + 'Wikie/classes/requests.ttl',
        reqeustsDataset,
        { fetch: fetch }
      );

    }
    if (!(await isUrlContainer(podUrl + 'Wikie/messages'))) {
      const messages = await createContainerAt(podUrl + 'Wikie/messages', { fetch: fetch });
      let messagesDataset = await createSolidDataset();
      const savedSolidDatasetContainer = await saveSolidDatasetAt(
        podUrl + 'Wikie/messages/contacts.ttl',
        messagesDataset,
        { fetch: fetch }
      );
    }

    let accessControlPolicy: AccessControlPolicy = await isWacOrAcp(podUrl + 'Wikie/')

    if (accessControlPolicy === AccessControlPolicy.WAC) {
      await initializeAcl(podUrl + 'Wikie/classes/requests.ttl')
      await initializeAcl(podUrl + 'Wikie/messages/contacts.ttl')
    }

    universalAccess.setPublicAccess(
      podUrl + 'Wikie/messages/contacts.ttl',         // Resource
      { append: true, read: true, write: false },          // Access object
      { fetch: fetch }                         // fetch function from authenticated session
    ).then((newAccess) => {
      console.log("newAccess       contacts.ttl")
    });
    universalAccess.setPublicAccess(
      podUrl + 'Wikie/classes/requests.ttl',         // Resource
      { append: true, read: true, write: false },          // Access object
      { fetch: fetch }                         // fetch function from authenticated session
    ).then((newAccess) => {
      console.log("newAccess  vrequests")
    });

    return { podUrl, accessControlPolicy }
  }
  throw new Error("There is problem with SolidPod.");
}

export async function getMindMapList(userSession: UserSession) {

  const readingListUrl: string = userSession.podUrl + 'Wikie/mindMaps/'
  const myDataset = await getSolidDataset(
    readingListUrl,
    { fetch: fetch }          // fetch from authenticated session
  );

  // const myDataset = await getSolidDatasetWithAcl(readingListUrl);
  const resourceUrls = await getContainedResourceUrlAll(myDataset);

  const resultResources: { url: string; title: string | null }[] = []
  for (var res of resourceUrls) {
    const dat = await getSolidDataset(res, { fetch: fetch })
    const things = getThingAll(dat);
    things.forEach(thing => {


      
      const types = getUrlAll(thing, RDF.type);
      if (types.some(type => type === mindMapDefinition.identity.subject)) {
        resultResources.push({
          url: res,
          title: getStringNoLocale(thing, mindMapDefinition.properties.title.vocabulary)
        })
      }
    });
  }
  console.log(resultResources)

  // const thing = getThing(myDataset, 'https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/');
  // const thing = getThingAll(myDataset);
  // console.log(thing)

  // if (thing !== null) {
  //   return getUrlAll(thing, 'http://www.w3.org/ns/ldp#contains');
  // }
  return resultResources
}
