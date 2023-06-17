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
  getStringNoLocale, universalAccess,
  getUrlAll,
  getUrl, getWebIdDataset, getPodUrlAllFrom,
  Thing,
  getProfileAll, getSourceUrl,
  getLinkedResourceUrlAll,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { MindMapLDO } from "../models/things/MindMapLDO";
import nodeDefinition from "../definitions/node.json"
import profileDefinition from "../definitions/profile.json"
import linkDefinition from "../definitions/link.json"
import mindMapDefinition from "../definitions/mindMapMetaData.json"
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { NodeLDO } from "../models/things/NodeLDO";
import { Connection } from "../models/types/Connection";
import { ConnectionLDO } from "../models/things/ConnectionLDO";
import { MindMap } from "../models/types/MindMap";
import { getPodUrl } from "./containerService";
import { generate_uuidv4 } from "./utils";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { UserSession } from "../models/types/UserSession";
import { SOLID } from "@inrupt/vocab-solid";

// export async function createProfile(userSession: UserSession, profile: Profile) {
//   const profiles = await getProfileAll(userSession.webId, { fetch });
//   const webIDProfileSolidDataset = profiles.webIdProfile;
//   const webIdThing = getThing(webIDProfileSolidDataset, userSession.webId);
//   if (webIdThing) {
//     const extendedProfilesSolidDatasets = profiles.altProfileAll;

//     let profileBuilder = new ProfileLDO((profileDefinition as LDO<Profile>))
//     // myExtendedProfile = setThing(myExtendedProfile, profileBuilder.create(profile));

//   }
//   // let myExtendedProfile = profiles.altProfileAll[0];
//   // let userDataThing = getThing(myExtendedProfile, userSession.webId);


//   // console.log(myExtendedProfile)
//   // console.log(userDataThing)
//   // await saveSolidDatasetAt(
//   //   getSourceUrl(myExtendedProfile),
//   //   myExtendedProfile,
//   //   { fetch: fetch }             // fetch from authenticated Session
//   // );
// }

export async function getProfile(userSession: UserSession): Promise<Profile | undefined> {

  const myDataset = await getSolidDataset(
    userSession.podUrl + 'Wikie/profile/profile.ttl',
    { fetch: fetch }
  );
  const profileThing = getThing(myDataset, userSession.podUrl + 'Wikie/profile/profile.ttl#Wikie')

  let profileLDO = new ProfileLDO(profileDefinition)
  let profile: Profile | null = null;
  profile = profileLDO.read(profileThing)
  return profile
}

export async function updateProfile(userSession: UserSession, profile: Profile): Promise<Profile | undefined> {

  const myDataset = await getSolidDataset(
    userSession.podUrl + 'Wikie/profile/profile.ttl',
    { fetch: fetch }
  );

  const profileLDO = new ProfileLDO(profileDefinition).create(profile)
  const savedProfileSolidDataset = setThing(myDataset, profileLDO)
  let newName = userSession.podUrl + "Wikie/profile/profile.ttl"
  const savedSolidDataset = await saveSolidDatasetAt(
    newName,
    savedProfileSolidDataset,
    { fetch: fetch }
  );
  return profile
}

