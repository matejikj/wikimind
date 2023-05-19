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
  getSolidDatasetWithAcl,
  getUrl,
  getPodUrlAll,
  isContainer,
  getContainedResourceUrlAll,
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
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { NodeLDO } from "../models/things/NodeLDO";
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";
import { MindMap } from "../models/types/MindMap";

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

export async function checkContainer(sessionId: string) {
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
      const cont = createContainerAt(podUrl + 'Wikie/mindMaps', { fetch: fetch });
    }
    if (!(await isUrlContainer(podUrl + 'Wikie/classes'))) {
      const cont = createContainerAt(podUrl + 'Wikie/classes', { fetch: fetch });
    }
    const classesDatasetUrl = podUrl + 'Wikie/classes/classes.ttl'
    const classesDataset = await getDataset(classesDatasetUrl)
    if (classesDataset === null) {
      let courseSolidDataset = createSolidDataset();
      const savedSolidDatasetContainer = await saveSolidDatasetAt(
        classesDatasetUrl,
        courseSolidDataset,
        { fetch: fetch }
      );
    }
  }
}

export async function getDataset(url: string) {
  try { 
    const classesDataset = await getSolidDataset(url, { fetch: fetch })
    return classesDataset
  } catch (error) {
    return null
  }

}

export async function getMindMapList() {
  
  const readingListUrl: string = 'https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/'
  const myDataset = await getSolidDataset(
    readingListUrl,
    { fetch: fetch }          // fetch from authenticated session
  );

  // const myDataset = await getSolidDatasetWithAcl(readingListUrl);
  const resourceUrls = await getContainedResourceUrlAll(myDataset);

  const resultResources: {url: string; title: string | null}[] = []
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
