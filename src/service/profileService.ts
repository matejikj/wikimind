import { Profile } from "../models/types/Profile";
import { ProfileRepository } from "../repository/profileRepository";
import { PROFILE, TTLFILETYPE, WIKIMIND } from "./containerService";

/**
 * Service class for managing user profiles.
 */
export class ProfileService {
  private profileRepository: ProfileRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  /**
   * Gets the user profile for the specified Pod URL.
   * @param podUrl - The URL of the user's Pod.
   * @returns A Promise that resolves with the user's Profile, or undefined if the profile is not found or an error occurs.
   */
  async getProfile(podUrl: string): Promise<Profile | undefined> {
    try {
      const profileUrl = `${podUrl}${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;
      return await this.profileRepository.getProfile(profileUrl);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  /**
   * Updates the user profile for the specified Pod URL.
   * @param podUrl - The URL of the user's Pod.
   * @param profile - The updated user Profile object.
   * @returns A Promise that resolves with the updated user Profile, or undefined if an error occurs.
   */
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
