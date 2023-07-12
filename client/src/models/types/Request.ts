import { RequestType } from "./RequestType";

/**
 * Represents a request made by a user for a specific class.
 */
export type Request = {
  /**
   * The unique identifier of the request.
   */
  id: string;

  /**
   * The user who made the request.
   */
  requestor: string;

  /**
* The user who made the request.
*/
  requestType: RequestType;

  /**
   * The class associated with the request.
   */
  subject: string;
}
