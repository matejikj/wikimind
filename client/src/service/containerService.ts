import {
  createContainerAt,
  createSolidDataset,
  getPodUrlAll,
  getSolidDataset,
  isContainer,
  saveSolidDatasetAt,
  setThing,
  getContentType,
  universalAccess
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import profileDefinition from "../definitions/profile.json";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { AccessControlPolicy } from "../models/enums/AccessControlPolicy";
import { Profile } from "../models/types/Profile";
import { initializeAcl, isWacOrAcp } from "./accessService";
import { UserSession } from "../models/UserSession";

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
 * @param {UserSession} userSession - The session ID of the user.
 * @returns {Promise<void>} - A Promise resolving to an object containing the POD URL and the access control policy.
 * @throws {Error} - Throws an error if there is a problem with the SolidPod.
 */
export async function checkContainer(userSession: UserSession): Promise<void> {

    await checkMainContainer(userSession.podUrl)

    await Promise.all([
      checkMindMapsContainer(userSession.podUrl),
      checkProfileContainer(userSession.podUrl, userSession.webId, userSession.podAccessControlPolicy),
      checkChatsContainer(userSession.podUrl),
      checkClassesContainer(userSession.podUrl),
      checkRequestsContainer(userSession.podUrl)
    ]);

    const requestsPath = WIKIMIND + SLASH + REQUESTS + SLASH + REQUESTS + TTLFILETYPE
    const profilePAth = WIKIMIND + SLASH + PROFILE + SLASH + PROFILE + TTLFILETYPE

    if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
      await initializeAcl(userSession.podUrl + requestsPath);
      await initializeAcl(userSession.podUrl + profilePAth);
    }

    universalAccess.setPublicAccess(
      userSession.podUrl + requestsPath,
      { append: true, read: true, write: false },
      { fetch: fetch }
    )
    universalAccess.setPublicAccess(
      userSession.podUrl + profilePAth,
      { append: false, read: true, write: false },
      { fetch: fetch }
    )
}
