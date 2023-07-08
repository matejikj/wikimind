import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    getThingAll,
    getUrlAll
} from "@inrupt/solid-client";
import profileDefinition from "../definitions/profile.json";
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
import chatDefinition from "../definitions/chat.json";
import connectionDefinition from "../definitions/connection.json";
import { RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { Chat } from "../models/types/Chat";
import { ChatLDO } from "../models/things/ChatLDO";


export class ChatRepository {
    async getChat(chatUrl: string): Promise<Chat | undefined> {
        const chatDataset = await getSolidDataset(chatUrl, { fetch });
        const chatLDO = new ChatLDO(chatDefinition)
        const thingId = `${chatUrl}#${getNumberFromUrl(chatUrl)}`
        return chatLDO.read(getThing(chatDataset, thingId))
    }

    async updateChat(chatUrl: string, mindMap: MindMap): Promise<MindMap | undefined> {
        const mindMapDataset = await getSolidDataset(chatUrl, { fetch });
        const mindMapBuilder = new MindMapLDO(mindMapDefinition)
        const thingId = `${chatUrl}#${getNumberFromUrl(chatUrl)}`
        return mindMapBuilder.read(getThing(mindMapDataset, thingId))
    }
}
