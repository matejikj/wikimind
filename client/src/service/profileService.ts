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
  getStringNoLocale,universalAccess,
  getUrlAll,
  getUrl,
  Thing,
  getProfileAll,getSourceUrl,
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
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";
import { MindMap } from "../models/types/MindMap";
import { getPodUrl } from "./containerService";
import { generate_uuidv4 } from "./utils";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { UserSession } from "../models/types/UserSession";

export async function createProfile(userSession: UserSession, profile: Profile) {
    const profiles = await getProfileAll(userSession.webId, { fetch });

    let myExtendedProfile = profiles.altProfileAll[0];
    let userDataThing = getThing(myExtendedProfile, userSession.webId);

    let profileBuilder = new ProfileLDO((profileDefinition as LDO<Profile>))
    myExtendedProfile = setThing(myExtendedProfile, profileBuilder.create(profile));

    console.log(myExtendedProfile)
    console.log(userDataThing)
    await saveSolidDatasetAt(
        getSourceUrl(myExtendedProfile),
        myExtendedProfile,
        { fetch: fetch }             // fetch from authenticated Session
      );
}

export async function getProfile(userSession: UserSession) {
    const profiles = await getProfileAll(userSession.webId, { fetch });

    let myExtendedProfile = profiles.altProfileAll[0];
    let bb = getThing(myExtendedProfile, userSession.podUrl + "profile#Wikie");
    let profileBuilder = new ProfileLDO((profileDefinition as LDO<Profile>))

    if (bb === null) {
        console.log("AAAAAAA")
        createProfile(userSession, { webId: userSession.webId, name: "jakub", surname: "matejik"})
        universalAccess.setPublicAccess(
            userSession.podUrl + "profile#Wikie",  // Resource
            { read: true, write: false },    // Access object
            { fetch: fetch }                 // fetch function from authenticated session
          ).then((newAccess) => {
            if (newAccess === null) {
              console.log("Could not load access details for this Resource.");
            } else {
              console.log("Returned Public Access:: ", JSON.stringify(newAccess));
          
            }
          });
    } else {
        return profileBuilder.read(bb)
    }
}
