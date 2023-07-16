import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    getThingAll,
    getUrlAll,
    removeThing
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
import messageDefinition from "../definitions/message.json";
import connectionDefinition from "../definitions/connection.json";
import { RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { Chat } from "../models/types/Chat";
import { ChatLDO } from "../models/things/ChatLDO";
import { Message } from "../models/types/Message";
import { MessageLDO } from "../models/things/MessageLDO";


export class MessageRepository {
    private messageLDO: MessageLDO

    constructor() {
        this.messageLDO = new MessageLDO(messageDefinition);
    }

    async createMessage(listUrl: string, message: Message): Promise<void> {
        let mindMapListDataset = await getSolidDataset(listUrl, { fetch });
        mindMapListDataset = setThing(mindMapListDataset, this.messageLDO.create(message));
        await saveSolidDatasetAt(listUrl, mindMapListDataset, { fetch });
    }

    async removeMessage(listUrl: string, message: Message): Promise<void> {
        let requestDataset = await getSolidDataset(listUrl, { fetch });
        const thingId = `${listUrl}#${message.id}`

        const thing = getThing(requestDataset, thingId);
        if (thing) {
            requestDataset = removeThing(requestDataset, thing)
            await saveSolidDatasetAt(listUrl, requestDataset, { fetch });
        }
    }

    async getMessages(storageUrl: string): Promise<Message[]> {
        const mindmapStorageDataset = await getSolidDataset(storageUrl, { fetch });
        const chatStorageThings = await getThingAll(mindmapStorageDataset);
        const messages: Message[] = [];
        chatStorageThings.forEach((thing) => {
            const types = getUrlAll(thing, RDF.type);
            if (types.includes(messageDefinition.identity)) {
                messages.push(this.messageLDO.read(thing));
            }
        });
        return messages
    }
}
