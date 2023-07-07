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
import { ProfileRepository } from "../repository/profileRepository";

export class ProfileService {
  private profileRepository: ProfileRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  async getProfile(userSession: UserSession): Promise<Profile | undefined> {
    try {
      const profileUrl = `${userSession.podUrl}${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;
      return await this.profileRepository.getProfile(profileUrl);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async updateProfile(userSession: UserSession, profile: Profile): Promise<Profile | undefined> {
    try {
      const profileUrl = `${userSession.podUrl}${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;
      return await this.profileRepository.updateProfile(profileUrl, profile);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
