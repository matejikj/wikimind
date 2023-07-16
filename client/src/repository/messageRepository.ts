import {
    getSolidDataset,
    getThing,
    getThingAll,
    getUrlAll,
    removeThing,
    saveSolidDatasetAt,
    setThing
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { RDF } from "@inrupt/vocab-common-rdf";
import messageDefinition from "../definitions/message.json";
import { MessageLDO } from "../models/things/MessageLDO";
import { Message } from "../models/types/Message";


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
