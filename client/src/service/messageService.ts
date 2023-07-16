import { fetch } from "@inrupt/solid-client-authn-browser";

import {
    getSolidDataset,
    getThing,
    getThingAll,
    setThing,
    saveSolidDatasetAt,
    getUrlAll,
} from "@inrupt/solid-client";



import { RDF } from "@inrupt/vocab-common-rdf";
import profileDefinition from "../definitions/profile.json"
import chatDefinition from "../definitions/chat.json"
import messageDefinition from "../definitions/message.json"
import mindMapDefinition from "../definitions/mindMap.json"
import linkDefinition from "../definitions/link.json"
import { LDO } from "../models/LDO";
import { CHATS, TTLFILETYPE, WIKIMIND, getPodUrl } from "./containerService";
import { LinkLDO } from "../models/things/LinkLDO";
import { LinkType } from "../models/types/LinkType";
import { UserSession } from "../models/types/UserSession";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { MessageLDO } from "../models/things/MessageLDO";
import { Message } from "../models/types/Message";
import { ChatLDO } from "../models/things/ChatLDO";
import { Chat } from "../models/types/Chat";
import { ChatDataset } from "../models/types/ChatDataset";
import { ChatRepository } from "../repository/chatRepository";
import { MessageRepository } from "../repository/messageRepository";
import { LinkRepository } from "../repository/linkRepository";

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
