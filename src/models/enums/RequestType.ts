/**
 * Enum representing different types of links.
 */
export enum RequestType {
  /**
   * Link type for removing a class.
   */
  REMOVE_CLASS = 'REMOVE_CLASS',

  /**
   * Link type for removing a chat.
   */
  REMOVE_CHAT = 'REMOVE_CHAT',

  /**
   * Link type for sending a class request.
   */
  CLASS_REQUEST = 'CLASS_REQUEST',

  /**
   * Link type for adding a class.
   */
  ADD_CLASS = 'ADD_CLASS',

  /**
   * Link type for adding a contact.
   */
  ADD_CONTACT = 'ADD_CONTACT',
}
