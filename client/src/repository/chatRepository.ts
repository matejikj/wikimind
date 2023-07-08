import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    getThingAll,
    getUrlAll,
    createSolidDataset
} from "@inrupt/solid-client";
import profileDefinition from "../definitions/profile.json";
import chatDefinition from "../definitions/chat.json";
import mindMapDefinition from "../definitions/mindMap.json";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { UserSession } from "../models/types/UserSession";
import { MRIZKA, PROFILE, SLASH, TTLFILETYPE, WIKIMIND } from "../service/containerService";
import { MindMap } from "../models/types/MindMap";
import { MindMapLDO } from "../models/things/MindMapLDO";
import { getNumberFromUrl } from "./utils";
import { Connection } from "../models/types/Connection";
import { NodeLDO } from "../models/things/NodeLDO";
import { ConnectionLDO } from "../models/things/ConnectionLDO";
import connectionDefinition from "../definitions/connection.json";
import { RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { Chat } from "../models/types/Chat";
import { ChatLDO } from "../models/things/ChatLDO";


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
