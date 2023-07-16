import { Chat } from "../models/types/Chat";
import { ChatDataset } from "../models/types/ChatDataset";
import { Message } from "../models/types/Message";
import { ChatRepository } from "../repository/chatRepository";
import { LinkRepository } from "../repository/linkRepository";
import { MessageRepository } from "../repository/messageRepository";
import { CHATS, TTLFILETYPE, WIKIMIND } from "./containerService";

export class MessageService {
  private chatRepository: ChatRepository;
  private messageRepository: MessageRepository;
  private linkRepository: LinkRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
    this.messageRepository = new MessageRepository();
    this.linkRepository = new LinkRepository();
  }

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


  async sendMessage(chat: Chat, message: Message): Promise<void> {
    // const url = `${chat.source}${WIKIMIND}/${CHATS}/${chat.storage}${TTLFILETYPE}`
    await this.messageRepository.createMessage(chat.storage, message)
  }  
}
