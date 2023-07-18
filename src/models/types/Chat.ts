import { AccessControlPolicy } from "../enums/AccessControlPolicy";

/**
 * Represents a chat conversation.
 */
export type Chat = {
  /**
   * The unique identifier of the chat.
   */
  id: string;

  /**
   * The owner of the chat.
   */
  host: string;

  /**
   * The guest user participating in the chat.
   */
  guest: string;

  /**
   * The storage location of the chat data.
   */
  storage: string;

  /**
   * The source from which the chat data originates.
   */
  source: string;

  /**
   * The access control policy associated with the chat.
   */
  accessControlPolicy: AccessControlPolicy;

  /**
   * The content of the last message sent in the chat.
   */
  lastMessage: string;

  /**
   * The timestamp when the chat was last modified.
   */
  modified: string;
}
