import {
  createSolidDataset,
  getSolidDataset,
  getThing,
  saveSolidDatasetAt,
  setThing
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import chatDefinition from "../definitions/chat.json";
import { ChatLDO } from "../models/things/ChatLDO";
import { Chat } from "../models/types/Chat";
import { getNumberFromUrl } from "./utils";
import { CHATS, MINDMAPS, TTLFILETYPE, WIKIMIND } from "../service/containerService";

/**
 * Represents a repository for managing chat data using Solid data storage.
 */
export class ChatRepository {
  private chatLDO: ChatLDO;
  
  /**
   * Creates a new instance of the ChatRepository class.
   */
  constructor() {
    this.chatLDO = new ChatLDO(chatDefinition);
  }

  /**
   * Retrieves chat data from Solid data storage.
   * @param chatUrl - The URL of the chat to retrieve.
   * @returns A Promise that resolves to the Chat object if found, or undefined if not found.
   */
  async getChat(chatUrl: string): Promise<Chat | undefined> {
    const chatDataset = await getSolidDataset(chatUrl, { fetch });
    const thingId = `${chatUrl}#${getNumberFromUrl(chatUrl)}`;
    return this.chatLDO.read(getThing(chatDataset, thingId));
  }

  /**
   * Creates a new chat and saves it to Solid data storage.
   * @param chatUrl - The URL where the new chat will be saved.
   * @param chat - The Chat object representing the chat to be created.
   * @returns A Promise that resolves when the chat is successfully created and saved.
   */
  async createChat(chatUrl: string, chat: Chat): Promise<void> {
    let chatDataset = createSolidDataset();
    chatDataset = setThing(chatDataset, this.chatLDO.create(chat));
    await saveSolidDatasetAt(chatUrl, chatDataset, { fetch });
  }

  async updateChat(chat: Chat): Promise<void> {
    const url = `${chat.source}${WIKIMIND}/${CHATS}/${chat.id}${TTLFILETYPE}`;
    let mindMapDataset = await getSolidDataset(url, { fetch });
    mindMapDataset = setThing(mindMapDataset, this.chatLDO.create(chat));
    await saveSolidDatasetAt(url, mindMapDataset, { fetch });
  }
}
