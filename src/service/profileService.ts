import { Profile } from "../models/types/Profile";
import { ProfileRepository } from "../repository/profileRepository";
import { PROFILE, TTLFILETYPE, WIKIMIND } from "./containerService";

export class ProfileService {
  private profileRepository: ProfileRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  async getProfile(podUrl: string): Promise<Profile | undefined> {
    try {
      const profileUrl = `${podUrl}${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;
      return await this.profileRepository.getProfile(profileUrl);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async updateProfile(podUrl: string, profile: Profile): Promise<Profile | undefined> {
    try {
      const profileUrl = `${podUrl}${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;
      return await this.profileRepository.updateProfile(profileUrl, profile);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
