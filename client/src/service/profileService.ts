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
import { LinkLDO } from "../models/things/LinkLDO";
import { MindMap } from "../models/types/MindMap";
import { getPodUrl } from "./containerService";
import { generate_uuidv4 } from "./utils";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { UserSession } from "../models/types/UserSession";
import { SOLID } from "@inrupt/vocab-solid";

export async function createProfile(userSession: UserSession, profile: Profile) {
  const profiles = await getProfileAll(userSession.webId, { fetch });
  const webIDProfileSolidDataset = profiles.webIdProfile;
  const webIdThing = getThing(webIDProfileSolidDataset, userSession.webId);
  if (webIdThing) {
    const extendedProfilesSolidDatasets = profiles.altProfileAll;

    let profileBuilder = new ProfileLDO((profileDefinition as LDO<Profile>))
    // myExtendedProfile = setThing(myExtendedProfile, profileBuilder.create(profile));

  }
  // let myExtendedProfile = profiles.altProfileAll[0];
  // let userDataThing = getThing(myExtendedProfile, userSession.webId);


  // console.log(myExtendedProfile)
  // console.log(userDataThing)
  // await saveSolidDatasetAt(
  //   getSourceUrl(myExtendedProfile),
  //   myExtendedProfile,
  //   { fetch: fetch }             // fetch from authenticated Session
  // );
}

export async function getProfile(userSession: UserSession) {
  const profiles = await getProfileAll(userSession.webId, { fetch });

  const webIDProfileSolidDataset = profiles.webIdProfile;
  const webIdThing = getThing(webIDProfileSolidDataset, userSession.webId);
  if (webIdThing) {
    const issuers = getUrlAll(webIdThing, SOLID.oidcIssuer);
    const extendedProfilesSolidDatasets = profiles.altProfileAll;
    let aaaa = await getWebIdDataset(userSession.webId);

    const prrr = getThing(aaaa, userSession.webId.split("#")[0] + "#Wikie")
    const profile: Profile = {
      webId: userSession.webId,
      name: "aaa",
      surname: "bbb"
    }
    let profileBuilder = new ProfileLDO((profileDefinition as LDO<Profile>))


    aaaa = setThing(aaaa, profileBuilder.create(profile));
    const savedProfileDatatset = await saveSolidDatasetAt(
      userSession.webId,
      aaaa,
      { fetch: fetch }
    );

    if (extendedProfilesSolidDatasets.length === 0) {

      const profile: Profile = {
        webId: userSession.webId,
        name: "aaa",
        surname: "bbb"
      }

      createProfile(userSession, profile)
    } else {
      let myExtendedProfile = profiles.altProfileAll[0];
      let bb = getThing(myExtendedProfile, userSession.podUrl + "profile#Wikie");
      let profileBuilder = new ProfileLDO((profileDefinition as LDO<Profile>))

    }

    console.log(extendedProfilesSolidDatasets)
  }

  // let myExtendedProfile = profiles.altProfileAll[0];
  // let bb = getThing(myExtendedProfile, userSession.podUrl + "profile#Wikie");
  // let profileBuilder = new ProfileLDO((profileDefinition as LDO<Profile>))

  // if (bb === null) {
  //     console.log("AAAAAAA")
  //     createProfile(userSession, { webId: userSession.webId, name: "jakub", surname: "matejik"})
  //     universalAccess.setPublicAccess(
  //         userSession.podUrl + "profile#Wikie",  // Resource
  //         { read: true, write: false },    // Access object
  //         { fetch: fetch }                 // fetch function from authenticated session
  //       ).then((newAccess) => {
  //         if (newAccess === null) {
  //           console.log("Could not load access details for this Resource.");
  //         } else {
  //           console.log("Returned Public Access:: ", JSON.stringify(newAccess));

  //         }
  //       });
  // } else {
  //     return profileBuilder.read(bb)
  // }
}
