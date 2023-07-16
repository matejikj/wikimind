import {
  createContainerAt,
  createSolidDataset,
  getPodUrlAll,
  getSolidDataset,
  isContainer,
  saveSolidDatasetAt,
  setThing,
  universalAccess
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import profileDefinition from "../definitions/profile.json";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";
import { Profile } from "../models/types/Profile";
import { initializeAcl, isWacOrAcp } from "./accessService";

export const WIKIMIND = 'WikiMind'
export const MINDMAPS = 'mindMaps'
export const SLASH = '/'
export const CLASSES = 'classes'
export const TTLFILETYPE = '.ttl'
export const REQUESTS = 'requests'
export const PROFILE = 'profile'
export const CHATS = 'chats'
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
    console.log(error);
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
    await createContainerAt(podUrl + WIKIMIND + SLASH + MINDMAPS, { fetch: fetch });
    const mindmapsDataset = createSolidDataset();
    saveSolidDatasetAt(
      podUrl + WIKIMIND + SLASH + MINDMAPS + SLASH + MINDMAPS + TTLFILETYPE,
      mindmapsDataset,
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
  }
}

async function checkRequestsContainer(podUrl: string): Promise<void> {
  if (!(await isUrlContainer(podUrl + WIKIMIND + SLASH + REQUESTS))) {
    await createContainerAt(podUrl + WIKIMIND + SLASH + REQUESTS, { fetch: fetch });
    const reqeustsDataset = createSolidDataset();
    saveSolidDatasetAt(
      podUrl + WIKIMIND + SLASH + REQUESTS + SLASH + REQUESTS + TTLFILETYPE,
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
      webId: sessionId,
      source: podUrl,
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
        )
      })
    }
  }
}

async function checkChatsContainer(podUrl: string): Promise<void> {
  if (!(await isUrlContainer(podUrl + WIKIMIND + SLASH + CHATS))) {
    await createContainerAt(podUrl + WIKIMIND + SLASH + CHATS, { fetch: fetch });

    const messagesDataset = await createSolidDataset();
    await saveSolidDatasetAt(
      podUrl + WIKIMIND + SLASH + CHATS + SLASH+ CHATS + TTLFILETYPE,
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
    await Promise.all([
      checkMindMapsContainer(podUrl),
      checkProfileContainer(podUrl, sessionId, accessControlPolicy),
      checkChatsContainer(podUrl),
      checkClassesContainer(podUrl),
      checkRequestsContainer(podUrl)
    ]);

    const requestsPath = WIKIMIND + SLASH + REQUESTS + SLASH + REQUESTS + TTLFILETYPE
    const profilePAth = WIKIMIND + SLASH + PROFILE + SLASH + PROFILE + TTLFILETYPE

    if (accessControlPolicy === AccessControlPolicy.WAC) {
      await initializeAcl(podUrl + requestsPath);
      await initializeAcl(podUrl + profilePAth);
    }

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
