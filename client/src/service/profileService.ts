import { fetch } from "@inrupt/solid-client-authn-browser";

import {
  getSolidDataset,
  getThing,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import profileDefinition from "../definitions/profile.json"
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { UserSession } from "../models/types/UserSession";
import { MRIZKA, PROFILE, SLASH, TTLFILETYPE, WIKIMIND } from "./containerService";

export async function getProfile(userSession: UserSession): Promise<Profile | undefined> {

  const myDataset = await getSolidDataset(
    userSession.podUrl + WIKIMIND + SLASH + PROFILE + SLASH + PROFILE + TTLFILETYPE,
    { fetch: fetch }
  );
  const profileThing = getThing(myDataset, userSession.podUrl + WIKIMIND + SLASH + PROFILE + SLASH + PROFILE + TTLFILETYPE + MRIZKA + WIKIMIND)

  const profileLDO = new ProfileLDO(profileDefinition)
  let profile: Profile | null = null;
  profile = profileLDO.read(profileThing)
  return profile
}

export async function updateProfile(userSession: UserSession, profile: Profile): Promise<Profile | undefined> {
  const myDataset = await getSolidDataset(
    userSession.podUrl + WIKIMIND + SLASH + PROFILE + SLASH + PROFILE + TTLFILETYPE,
    { fetch: fetch }
  );

  const profileLDO = new ProfileLDO(profileDefinition).create(profile)
  const savedProfileSolidDataset = setThing(myDataset, profileLDO)
  const newName = userSession.podUrl + WIKIMIND + SLASH + PROFILE + SLASH + PROFILE + TTLFILETYPE
  const savedSolidDataset = await saveSolidDatasetAt(
    newName,
    savedProfileSolidDataset,
    { fetch: fetch }
  );
  return profile
}

