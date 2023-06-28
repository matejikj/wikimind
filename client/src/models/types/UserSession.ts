import { AccessControlPolicy } from "./AccessControlPolicy";

/**
 * Represents a user session with information about the user's web ID, POD URL, login status, and access control policy.
 */
export type UserSession = {
  /**
   * The web ID of the user.
   */
  webId: string;
  
  /**
   * The POD URL associated with the user.
   */
  podUrl: string;
  
  /**
   * Indicates whether the user is logged in or not.
   */
  isLogged: boolean;
  
  /**
   * The access control policy associated with the user's POD, or `null` if not available.
   */
  podAccessControlPolicy: AccessControlPolicy | null;
}

/**
 * The default value for a user session.
 */
export const defaultSessionValue: UserSession = {
  webId: "",
  podUrl: "",
  isLogged: false,
  podAccessControlPolicy: null,
}
