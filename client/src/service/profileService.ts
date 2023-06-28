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

  const profileLDO = new ProfileLDO(profileDefinition)
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
  const newName = userSession.podUrl + "Wikie/profile/profile.ttl"
  const savedSolidDataset = await saveSolidDatasetAt(
    newName,
    savedProfileSolidDataset,
    { fetch: fetch }
  );
  return profile
}

