import { fetch } from "@inrupt/solid-client-authn-browser";
import {
  getSolidDataset,
  getThing,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import profileDefinition from "../definitions/profile.json";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { UserSession } from "../models/types/UserSession";
import { MRIZKA, PROFILE, SLASH, TTLFILETYPE, WIKIMIND } from "./containerService";

export async function getProfile(userPodUrl: string): Promise<Profile | undefined> {
  const profileUrl = `${ userPodUrl }${ WIKIMIND }/${PROFILE}/${ PROFILE }${ TTLFILETYPE }`;
  const myDataset = await getSolidDataset(profileUrl, { fetch });
  const profileThingUrl = `${ profileUrl }${ MRIZKA }${ WIKIMIND }`;
  const profileThing = getThing(myDataset, profileThingUrl);

  const profileLDO = new ProfileLDO(profileDefinition);
  const profile = profileLDO.read(profileThing);
  return profile;
}

export async function updateProfile(userSession: UserSession, profile: Profile): Promise<Profile | undefined> {
  const profileUrl = `${ userSession.podUrl }${ WIKIMIND }/${PROFILE}/${ PROFILE }${ TTLFILETYPE }`;
  const myDataset = await getSolidDataset(profileUrl, { fetch });

  const profileLDO = new ProfileLDO(profileDefinition).create(profile);
  const savedProfileSolidDataset = setThing(myDataset, profileLDO);
  const newName = profileUrl;
  await saveSolidDatasetAt(newName, savedProfileSolidDataset, { fetch });

  return profile;
}