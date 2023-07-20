import { Chat } from "../models/types/Chat";
import { ChatDataset } from "../models/types/ChatDataset";
import { Message } from "../models/types/Message";
import { ChatRepository } from "../repository/chatRepository";
import { LinkRepository } from "../repository/linkRepository";
import { MessageRepository } from "../repository/messageRepository";
import { CHATS, TTLFILETYPE, WIKIMIND } from "./containerService";

/**
 * MessageService class provides methods for interacting with chats and messages.
 */
export class MessageService {
  private chatRepository: ChatRepository;
  private messageRepository: MessageRepository;
  private linkRepository: LinkRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
    this.messageRepository = new MessageRepository();
    this.linkRepository = new LinkRepository();
  }

  /**
   * Retrieves the list of chats associated with a Pod.
   * @param podUrl - The URL of the Pod.
   * @returns A Promise that resolves to an array of Chat objects, or undefined if there's an error.
   */
  async getChatList(podUrl: string): Promise<Chat[] | undefined> {
    try {
      const chats: Chat[] = []
      const chatLinksUrl = `${podUrl}${WIKIMIND}/${CHATS}/${CHATS}${TTLFILETYPE}`;
      const chatLinks = await this.linkRepository.getLinksList(chatLinksUrl);
      await Promise.all(chatLinks.map(async (link) => {
        const chat = await this.chatRepository.getChat(link.url)
        chat && chats.push(chat)
      }));
      return chats
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Retrieves the details of a specific chat and its messages.
   * @param chatUrl - The URL of the chat.
   * @returns A Promise that resolves to the ChatDataset object if found, otherwise undefined.
   */
  async getChat(chatUrl: string): Promise<ChatDataset | undefined> {
    try {
      const chat = await this.chatRepository.getChat(chatUrl)
      if (chat) {
        const messages: any = await this.messageRepository.getMessages(chat.storage)
        const chatDataset: ChatDataset = {
          chat: chat,
          messages: messages
        };
        return chatDataset;
      }
    }

    catch (error) {
      console.error(error);
      return undefined;
    }
  }


  /**
   * Sends a message to a chat and updates the last message.
   * @param chat - The Chat object representing the chat to which the message will be sent.
   * @param message - The Message object representing the message to be sent.
   * @returns A Promise that resolves to void.
   */
  async sendMessage(chat: Chat, message: Message): Promise<void> {
    chat.lastMessage = message.text
    await this.chatRepository.updateChat(chat)

    // const url = `${chat.source}${WIKIMIND}/${CHATS}/${chat.storage}${TTLFILETYPE}`
    await this.messageRepository.createMessage(chat.storage, message)

  }
}
