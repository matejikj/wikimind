import {
  getSolidDataset,
  getThing,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import profileDefinition from "../definitions/profile.json";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { Profile } from "../models/types/Profile";
import { WIKIMIND } from "../service/containerService";


export class ProfileRepository {
    async getProfile(profileUrl: string): Promise<Profile | undefined> {
      const myDataset = await getSolidDataset(profileUrl, { fetch });
      const profileThingUrl = `${profileUrl}#${WIKIMIND}`;
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