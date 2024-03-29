/**
 * Represents a user profile.
 */
export type Profile = {
  /**
   * The web ID associated with the profile.
   */
  webId: string;

  /**
   * The name of the profile.
   */
  name: string;

  /**
   * The surname or last name of the profile.
   */
  surname: string;

  /**
   * The source from which the profile is obtained.
   */
  source: string;
}
