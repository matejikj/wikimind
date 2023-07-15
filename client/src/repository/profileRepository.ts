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
import { MRIZKA, PROFILE, SLASH, TTLFILETYPE, WIKIMIND } from "../service/containerService";


export class ProfileRepository {
    async getProfile(profileUrl: string): Promise<Profile | undefined> {
      const myDataset = await getSolidDataset(profileUrl, { fetch });
      const profileThingUrl = `${profileUrl}#${WIKIMIND}`;
      if (profileThingUrl === "https://inrupt.com/.well-known/sdk-local-node/WikiMind/profile/profile.ttl#WikiMind") {
        console.log()
      }
      const profileThing = getThing(myDataset, profileThingUrl);
      const profileLDO = new ProfileLDO(profileDefinition);
      const profile = profileLDO.read(profileThing);
      return profile;
    }
  
    async updateProfile(url: string, profile: Profile): Promise<Profile | undefined> {
      const myDataset = await getSolidDataset(url, { fetch });
      const profileLDO = new ProfileLDO(profileDefinition).create(profile);
      const savedProfileSolidDataset = setThing(myDataset, profileLDO);
      await saveSolidDatasetAt(url, savedProfileSolidDataset, { fetch });
      return profile;
    }
  }