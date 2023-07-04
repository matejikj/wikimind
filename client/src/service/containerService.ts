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
  saveSolidDatasetAt,createContainerInContainer,
  setThing,
  universalAccess,
} from "@inrupt/solid-client";
import { RDF } from "@inrupt/vocab-common-rdf";
import mindMapDefinition from "../definitions/mindMap.json";
import profileDefinition from "../definitions/profile.json";
import { UserSession } from "../models/types/UserSession";
import { initializeAcl, isWacOrAcp } from "./accessService";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";

export const WIKIMIND = 'WikiMind'
export const MINDMAPS = 'mindMaps'
export const SLASH = '/'
export const CLASSES = 'classes'
export const TTLFILETYPE = '.ttl'
export const REQUESTS = 'requests'
export const PROFILE = 'profile'
export const MESSAGES = 'messages'
export const CONTACTS = 'contacts'
export const MRIZKA = "#"

/**
 * Checks whether a given URL represents a container.
 *
 * @param {string} url - The URL to check.
 * @returns {Promise<boolean>} - A Promise resolving to a boolean indicating whether the URL represents a container.
 */
export async function isUrlContainer(url: string): Promise<boolean | undefined> {
  try {
    return await isContainer(await getSolidDataset(url, { fetch: fetch }));
  } catch (error) {
    console.log();
  }
}

/**
 * Retrieves the URL of the Solid POD of a user with a given session ID.
 *
 * @param {string} sessionId - The session ID of the user.
 * @returns {Promise<string[] | null>} - A Promise resolving to an array containing the POD URL(s) of the user, or null if no URL could be retrieved.
 */
export async function getPodUrl(sessionId: string): Promise<string[] | null> {
  try {
    return await getPodUrlAll(sessionId);
  } catch (error) {
    return null;
  }
}

async function checkMainContainer(podUrl: string): Promise<void> {
  if (!(await isUrlContainer(podUrl + WIKIMIND))) {
    await createContainerAt(podUrl + WIKIMIND, { fetch: fetch });
  }

}

async function checkMindMapsContainer(podUrl: string): Promise<void> {
  if (!(await isUrlContainer(podUrl + WIKIMIND + SLASH + MINDMAPS))) {
    createContainerAt(podUrl + WIKIMIND + SLASH + MINDMAPS, { fetch: fetch });
    const classesDataset = createSolidDataset();
    saveSolidDatasetAt(
      podUrl + WIKIMIND + SLASH + MINDMAPS + SLASH + MINDMAPS + TTLFILETYPE,
      classesDataset,
      { fetch: fetch }
    );

  }
}

async function checkClassesContainer(podUrl: string): Promise<void> {
  if (!(await isUrlContainer(podUrl + WIKIMIND + SLASH + CLASSES))) {
    await createContainerAt(podUrl + WIKIMIND + SLASH + CLASSES, { fetch: fetch });
    const classesDataset = createSolidDataset();
    saveSolidDatasetAt(
      podUrl + WIKIMIND + SLASH + CLASSES + SLASH + CLASSES + TTLFILETYPE,
      classesDataset,
      { fetch: fetch }
    );
    const reqeustsDataset = createSolidDataset();
    saveSolidDatasetAt(
      podUrl + WIKIMIND + SLASH + CLASSES + SLASH + REQUESTS + TTLFILETYPE,
      reqeustsDataset,
      { fetch: fetch }
    );
  }
}

async function checkProfileContainer(podUrl: string, sessionId: string, accessControlPolicy: AccessControlPolicy): Promise<void> {
  if (!(await isUrlContainer(podUrl + WIKIMIND + SLASH + PROFILE))) {
    await createContainerAt(podUrl + WIKIMIND + SLASH + PROFILE, { fetch: fetch });

    const profileSolidDataset = createSolidDataset();
    const blankProfile: Profile = {
      name: '',
      surname: '',
      profileImage: '',
      webId: sessionId,
    };
    const profileLDO = new ProfileLDO(profileDefinition).create(blankProfile);
    const savedProfileSolidDataset = setThing(profileSolidDataset, profileLDO);
    const profilePath = WIKIMIND + SLASH + PROFILE + SLASH + PROFILE + TTLFILETYPE
    await saveSolidDatasetAt(
      podUrl + profilePath,
      savedProfileSolidDataset,
      { fetch: fetch }
    );

    if (accessControlPolicy === AccessControlPolicy.WAC) {
      initializeAcl(podUrl + profilePath).then(() => {
        universalAccess.setPublicAccess(
          podUrl + profilePath,
          { append: true, read: true, write: false },
          { fetch: fetch }
        ).then((newAccess) => {
          console.log(newAccess);
        });
      })
    }
  }
}

async function checkMessagesContainer(podUrl: string): Promise<void> {
  if (!(await isUrlContainer(podUrl + WIKIMIND + SLASH + MESSAGES))) {
    await createContainerAt(podUrl + WIKIMIND + SLASH + MESSAGES, { fetch: fetch });

    const messagesDataset = await createSolidDataset();
    await saveSolidDatasetAt(
      podUrl + WIKIMIND + SLASH + MESSAGES + SLASH+ CONTACTS + TTLFILETYPE,
      messagesDataset,
      { fetch: fetch }
    );
  }
}

/**
 * Checks and initializes necessary containers and access control policies for a given session ID.
 *
 * @param {string} sessionId - The session ID of the user.
 * @returns {Promise<{ podUrl: string; accessControlPolicy: AccessControlPolicy }>} - A Promise resolving to an object containing the POD URL and the access control policy.
 * @throws {Error} - Throws an error if there is a problem with the SolidPod.
 */
export async function checkContainer(sessionId: string): Promise<{ podUrl: string; accessControlPolicy: AccessControlPolicy }> {
  const podUrls = await getPodUrl(sessionId);
  if (podUrls !== null) {
    const podUrl = podUrls[0];

    await checkMainContainer(podUrl)

    const accessControlPolicy: AccessControlPolicy = await isWacOrAcp(podUrl + WIKIMIND + SLASH);

    await Promise.all([checkMindMapsContainer(podUrl), checkProfileContainer(podUrl, sessionId, accessControlPolicy), checkMessagesContainer(podUrl), checkClassesContainer(podUrl)]);

    const contactsPath = WIKIMIND + SLASH + MESSAGES + SLASH + CONTACTS + TTLFILETYPE
    const requestsPath = WIKIMIND + SLASH + CLASSES + SLASH + REQUESTS + TTLFILETYPE
    const profilePAth = WIKIMIND + SLASH + PROFILE + SLASH + PROFILE + TTLFILETYPE

    if (accessControlPolicy === AccessControlPolicy.WAC) {
      await initializeAcl(podUrl + requestsPath);
      await initializeAcl(podUrl + contactsPath);
      await initializeAcl(podUrl + profilePAth);
    }

    universalAccess.setPublicAccess(
      podUrl + contactsPath,
      { append: true, read: true, write: false },
      { fetch: fetch }
    )
    universalAccess.setPublicAccess(
      podUrl + requestsPath,
      { append: true, read: true, write: false },
      { fetch: fetch }
    )
    universalAccess.setPublicAccess(
      podUrl + profilePAth,
      { append: false, read: true, write: false },
      { fetch: fetch }
    )

    return { podUrl, accessControlPolicy };
  }
  throw new Error("There is a problem with SolidPod.");
}

// /**
//  * Retrieves a list of mind maps associated with a user session.
//  *
//  * @param {UserSession} userSession - The user session.
//  * @returns {Promise<{ url: string; title: string | null }[]>} - A Promise resolving to an array of objects containing the URL and title of each mind map.
//  */
// export async function getMindMapList(userSession: UserSession): Promise<{ url: string; title: string | null }[]> {
//   const readingListUrl: string = userSession.podUrl + WIKIMIND + SLASH + MINDMAPS + SLASH;
//   const myDataset = await getSolidDataset(
//     readingListUrl,
//     { fetch: fetch }
//   );

//   const resourceUrls = await getContainedResourceUrlAll(myDataset);

//   const resultResources: { url: string; title: string | null }[] = [];
//   for (const res of resourceUrls) {
//     const dat = await getSolidDataset(res, { fetch: fetch });
//     const things = getThingAll(dat);
//     things.forEach((thing) => {
//       const types = getUrlAll(thing, RDF.type);
//       if (types.some((type) => type === mindMapDefinition.identity)) {
//         resultResources.push({
//           url: res,
//           title: getStringNoLocale(thing, mindMapDefinition.properties.id),
//         });
//       }
//     });
//   }
//   return resultResources;
// }
