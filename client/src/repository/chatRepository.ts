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


export class ChatRepository {
  private chatLDO: ChatLDO
  
  constructor() {
    this.chatLDO = new ChatLDO(chatDefinition);
  }

    async getChat(chatUrl: string): Promise<Chat | undefined> {
        const chatDataset = await getSolidDataset(chatUrl, { fetch });
        const thingId = `${chatUrl}#${getNumberFromUrl(chatUrl)}`
        return this.chatLDO.read(getThing(chatDataset, thingId))
    }

    async createChat(chatUrl: string, chat: Chat): Promise<void> {
      let mindMapDataset = createSolidDataset();
      mindMapDataset = setThing(mindMapDataset, this.chatLDO.create(chat));
      await saveSolidDatasetAt(chatUrl, mindMapDataset, { fetch });
  }

}
