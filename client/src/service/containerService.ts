import { fetch } from "@inrupt/solid-client-authn-browser";

import {
  createContainerAt,
  createSolidDataset,
  getContainedResourceUrlAll,
  getPodUrlAll,
  getSolidDataset,
  getStringNoLocale,
  getThingAll,
  getUrlAll,
  isContainer,
  saveSolidDatasetAt, setThing,
  universalAccess,
} from "@inrupt/solid-client";
import { RDF } from "@inrupt/vocab-common-rdf";
import mindMapDefinition from "../definitions/mindMapMetaData.json"
import profileDefinition from "../definitions/profile.json"
import { UserSession } from "../models/types/UserSession";
import { initializeAcl, isWacOrAcp } from "./accessService";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";

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
  
  const podUrls = await getPodUrl(sessionId)
  if (podUrls !== null) {
    const podUrl = podUrls[0]

    const accessControlPolicy: AccessControlPolicy = await isWacOrAcp(podUrl + 'Wikie/')
  
    if (!(await isUrlContainer(podUrl + 'Wikie/mindMaps'))) {
      const cont = await createContainerAt(podUrl + 'Wikie/mindMaps', { fetch: fetch });
    }
    if (!(await isUrlContainer(podUrl + 'Wikie/classes'))) {
      const classes = await createContainerAt(podUrl + 'Wikie/classes', { fetch: fetch });
      const classesDataset = createSolidDataset();
      const savedSolidDatasetContainer = await saveSolidDatasetAt(
        podUrl + 'Wikie/classes/classes.ttl',
        classesDataset,
        { fetch: fetch }
      );
      const reqeustsDataset = createSolidDataset();
      const savedSolidDataset = await saveSolidDatasetAt(
        podUrl + 'Wikie/classes/requests.ttl',
        reqeustsDataset,
        { fetch: fetch }
      );
    }

    if (!(await isUrlContainer(podUrl + 'Wikie/profile'))) {
      const classes = await createContainerAt(podUrl + 'Wikie/profile', { fetch: fetch });
      const classesDataset = createSolidDataset();

      const profileSolidDataset = createSolidDataset();
      const blankProfile: Profile = {
        name: '',
        surname: '',
        profileImage: '',
        webId: sessionId
      }
      const profileLDO = new ProfileLDO(profileDefinition).create(blankProfile)
      const savedProfileSolidDataset = setThing(profileSolidDataset, profileLDO)
      const newName = podUrl + "Wikie/profile/profile.ttl"
      const savedSolidDataset = await saveSolidDatasetAt(
        newName,
        savedProfileSolidDataset,
        { fetch: fetch }
      );
      if (accessControlPolicy === AccessControlPolicy.WAC) {
        await initializeAcl(podUrl + 'Wikie/profile/profile.ttl')
      }
      universalAccess.setPublicAccess(
        podUrl + 'Wikie/profile/profile.ttl',         // Resource
        { append: true, read: true, write: false },          // Access object
        { fetch: fetch }                         // fetch function from authenticated session
      ).then((newAccess) => {
        console.log("newAccess       contacts.ttl")
      });  
    }

    if (!(await isUrlContainer(podUrl + 'Wikie/messages'))) {
      const messages = await createContainerAt(podUrl + 'Wikie/messages', { fetch: fetch });
      const messagesDataset = await createSolidDataset();
      const savedSolidDatasetContainer = await saveSolidDatasetAt(
        podUrl + 'Wikie/messages/contacts.ttl',
        messagesDataset,
        { fetch: fetch }
      );
    }

    if (accessControlPolicy === AccessControlPolicy.WAC) {
      await initializeAcl(podUrl + 'Wikie/classes/requests.ttl')
      await initializeAcl(podUrl + 'Wikie/messages/contacts.ttl')
    }

    universalAccess.setPublicAccess(
      podUrl + 'Wikie/messages/contacts.ttl',
      { append: true, read: true, write: false },
      { fetch: fetch }
    ).then((newAccess) => {
      console.log("newAccess       contacts.ttl")
    });
    universalAccess.setPublicAccess(
      podUrl + 'Wikie/classes/requests.ttl',
      { append: true, read: true, write: false },
      { fetch: fetch }
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
    { fetch: fetch }
  );

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
          title: getStringNoLocale(thing, mindMapDefinition.properties.id.vocabulary)
        })
      }
    });
  }
  return resultResources
}
