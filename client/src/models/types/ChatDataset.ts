import { Chat } from "./Chat";
import { Message } from "./Message";

/**
 * Represents a chat dataset that includes information about a chat and its associated messages.
 */
export type ChatDataset = {
  /**
   * The chat object containing details about the chat.
   */
  chat: Chat;
  
  /**
   * An array of messages exchanged within the chat.
   */
  messages: Message[];
}
