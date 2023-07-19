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

// Constants for container names, file types, and separators.
export const WIKIMIND = "WikiMind";
export const MINDMAPS = "mindMaps";
export const CLASSES = "classes";
export const TTLFILETYPE = ".ttl";
export const REQUESTS = "requests";
export const PROFILE = "profile";
export const CHATS = "chats";
export const MRIZKA = "#";
export const SLASH = '/';

/**
 * Checks whether a given URL represents a container.
 *
 * @param {string} url - The URL to check.
 * @returns {Promise<boolean>} - A Promise resolving to a boolean indicating whether the URL represents a container.
 */
export async function existsSource(url: string): Promise<boolean | undefined> {
  try {
    await getSolidDataset(url, { fetch: fetch });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks the main container for the provided pod URL and creates it if it doesn't exist.
 *
 * @param {string} podUrl - The pod URL to check.
 * @returns {Promise<void>} - A Promise resolving to void.
 */
async function checkMainContainer(podUrl: string): Promise<void> {
  if (!(await existsSource(`${podUrl}${WIKIMIND}/`))) {
    await createContainerAt(`${podUrl}${WIKIMIND}/`, { fetch: fetch });
  }
}

/**
 * Checks the MindMaps container for the provided pod URL and creates it if it doesn't exist.
 *
 * @param {string} podUrl - The pod URL to check.
 * @returns {Promise<void>} - A Promise resolving to void.
 */
async function checkMindMapsContainer(podUrl: string): Promise<void> {
  if (!(await existsSource(`${podUrl}${WIKIMIND}/${MINDMAPS}/`))) {
    await createContainerAt(`${podUrl}${WIKIMIND}/${MINDMAPS}/`, { fetch: fetch });
    const mindmapsDataset = createSolidDataset();
    saveSolidDatasetAt(
      `${podUrl}${WIKIMIND}/${MINDMAPS}/${MINDMAPS}${TTLFILETYPE}`,
      mindmapsDataset,
      { fetch: fetch }
    );
  }
}

/**
 * Checks the Classes container for the provided pod URL and creates it if it doesn't exist.
 *
 * @param {string} podUrl - The pod URL to check.
 * @returns {Promise<void>} - A Promise resolving to void.
 */
async function checkClassesContainer(podUrl: string): Promise<void> {
  if (!(await existsSource(`${podUrl}${WIKIMIND}/${CLASSES}/`))) {
    await createContainerAt(`${podUrl}${WIKIMIND}/${CLASSES}/`, { fetch: fetch });
    const classesDataset = createSolidDataset();
    saveSolidDatasetAt(
      `${podUrl}${WIKIMIND}/${CLASSES}/${CLASSES}${TTLFILETYPE}`,
      classesDataset,
      { fetch: fetch }
    );
  }
}

/**
 * Checks the Requests container for the provided pod URL and creates it if it doesn't exist.
 *
 * @param {string} podUrl - The pod URL to check.
 * @returns {Promise<void>} - A Promise resolving to void.
 */
async function checkRequestsContainer(podUrl: string): Promise<void> {
  if (!(await existsSource(`${podUrl}${WIKIMIND}/${REQUESTS}/`))) {
    await createContainerAt(`${podUrl}${WIKIMIND}/${REQUESTS}/`, { fetch: fetch });
    const reqeustsDataset = createSolidDataset();
    saveSolidDatasetAt(
      `${podUrl}${WIKIMIND}/${REQUESTS}/${REQUESTS}${TTLFILETYPE}`,
      reqeustsDataset,
      { fetch: fetch }
    );
  }
}

/**
 * Checks the Profile container for the provided pod URL and creates it if it doesn't exist.
 *
 * @param {string} podUrl - The pod URL to check.
 * @param {string} sessionId - The session ID of the user.
 * @param {AccessControlPolicy} accessControlPolicy - The access control policy for the container.
 * @returns {Promise<void>} - A Promise resolving to void.
 */
async function checkProfileContainer(podUrl: string, sessionId: string, accessControlPolicy: AccessControlPolicy): Promise<void> {
  if (!(await existsSource(`${podUrl}${WIKIMIND}/${PROFILE}/`))) {
    await createContainerAt(`${podUrl}${WIKIMIND}/${PROFILE}/`, { fetch: fetch });

    const profileSolidDataset = createSolidDataset();
    const blankProfile: Profile = {
      name: '',
      surname: '',
      webId: sessionId,
      source: podUrl,
    };
    const profileLDO = new ProfileLDO(profileDefinition).create(blankProfile);
    const savedProfileSolidDataset = setThing(profileSolidDataset, profileLDO);
    const profilePath = `${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;
    await saveSolidDatasetAt(
      `${podUrl}${profilePath}`,
      savedProfileSolidDataset,
      { fetch: fetch }
    );

    if (accessControlPolicy === AccessControlPolicy.WAC) {
      initializeAcl(`${podUrl}${profilePath}`).then(() => {
        universalAccess.setPublicAccess(
          `${podUrl}${profilePath}`,
          { append: true, read: true, write: false },
          { fetch: fetch }
        );
      });
    }
  }
}

/**
 * Checks the Chats container for the provided pod URL and creates it if it doesn't exist.
 *
 * @param {string} podUrl - The pod URL to check.
 * @returns {Promise<void>} - A Promise resolving to void.
 */
async function checkChatsContainer(podUrl: string): Promise<void> {
  if (!(await existsSource(`${podUrl}${WIKIMIND}/${CHATS}/`))) {
    await createContainerAt(`${podUrl}${WIKIMIND}/${CHATS}/`, { fetch: fetch });

    const messagesDataset = await createSolidDataset();
    await saveSolidDatasetAt(
      `${podUrl}${WIKIMIND}/${CHATS}/${CHATS}${TTLFILETYPE}`,
      messagesDataset,
      { fetch: fetch }
    );
  }
}

/**
 * Checks and initializes necessary containers and access control policies for a given session ID.
 *
 * @param {UserSession} userSession - The session ID of the user.
 * @returns {Promise<void>} - A Promise resolving to void.
 * @throws {Error} - Throws an error if there is a problem with the SolidPod.
 */
export async function checkContainer(userSession: UserSession): Promise<void> {
  try {
    await checkMainContainer(userSession.podUrl);

  await Promise.all([
    checkMindMapsContainer(userSession.podUrl),
    checkProfileContainer(userSession.podUrl, userSession.webId, userSession.podAccessControlPolicy),
    checkChatsContainer(userSession.podUrl),
    checkClassesContainer(userSession.podUrl),
    checkRequestsContainer(userSession.podUrl)
  ]);

  const requestsPath = `${WIKIMIND}/${REQUESTS}/${REQUESTS}${TTLFILETYPE}`;
  const profilePAth = `${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;

  if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
    await initializeAcl(`${userSession.podUrl}${requestsPath}`);
    await initializeAcl(`${userSession.podUrl}${profilePAth}`);
  }

  universalAccess.setPublicAccess(
    `${userSession.podUrl}${requestsPath}`,
    { append: true, read: true, write: false },
    { fetch: fetch }
  );

  universalAccess.setPublicAccess(
    `${userSession.podUrl}${profilePAth}`,
    { append: false, read: true, write: false },
    { fetch: fetch }
  );
  } catch (error) {
    throw error
  }
  
}
