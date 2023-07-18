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

/**
 * Represents a repository for managing user profile data using Solid data storage.
 */
export class ProfileRepository {
  /**
   * Retrieves a user profile from Solid data storage based on the provided profile URL.
   * @param profileUrl - The URL of the user profile to retrieve.
   * @returns A Promise that resolves to a Profile object representing the retrieved user profile, or undefined if not found.
   */
  async getProfile(profileUrl: string): Promise<Profile | undefined> {
    const myDataset = await getSolidDataset(profileUrl, { fetch });
    const profileThingUrl = `${profileUrl}#${WIKIMIND}`;
    const profileThing = getThing(myDataset, profileThingUrl);
    const profileLDO = new ProfileLDO(profileDefinition);
    const profile = profileLDO.read(profileThing);
    return profile;
  }

  /**
   * Updates an existing user profile in Solid data storage.
   * @param url - The URL of the user profile to be updated.
   * @param profile - The Profile object representing the updated user profile data.
   * @returns A Promise that resolves to the updated Profile object.
   */
  async updateProfile(url: string, profile: Profile): Promise<Profile | undefined> {
    const myDataset = await getSolidDataset(url, { fetch });
    const profileLDO = new ProfileLDO(profileDefinition).create(profile);
    const savedProfileSolidDataset = setThing(myDataset, profileLDO);
    await saveSolidDatasetAt(url, savedProfileSolidDataset, { fetch });
    return profile;
  }
}
