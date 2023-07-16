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
  
  /**
   * Represents a repository for managing message data using Solid data storage.
   */
  export class MessageRepository {
    private messageLDO: MessageLDO;
  
    /**
     * Creates a new instance of the MessageRepository class.
     */
    constructor() {
      this.messageLDO = new MessageLDO(messageDefinition);
    }
  
    /**
     * Creates a new message and adds it to the list in Solid data storage.
     * @param listUrl - The URL of the list where the new message will be added.
     * @param message - The Message object representing the message to be created.
     * @returns A Promise that resolves when the message is successfully created and saved to the list.
     */
    async createMessage(listUrl: string, message: Message): Promise<void> {
      let messageListDataset = await getSolidDataset(listUrl, { fetch });
      messageListDataset = setThing(messageListDataset, this.messageLDO.create(message));
      await saveSolidDatasetAt(listUrl, messageListDataset, { fetch });
    }
  
    /**
     * Removes a message from the list in Solid data storage.
     * @param listUrl - The URL of the list from which the message will be removed.
     * @param message - The Message object representing the message to be removed.
     * @returns A Promise that resolves when the message is successfully removed from the list.
     */
    async removeMessage(listUrl: string, message: Message): Promise<void> {
      let messageListDataset = await getSolidDataset(listUrl, { fetch });
      const thingId = `${listUrl}#${message.id}`;
      const thing = getThing(messageListDataset, thingId);
      if (thing) {
        messageListDataset = removeThing(messageListDataset, thing);
        await saveSolidDatasetAt(listUrl, messageListDataset, { fetch });
      }
    }
  
    /**
     * Retrieves all messages from Solid data storage under the given storage URL.
     * @param storageUrl - The URL of the storage where the messages are located.
     * @returns A Promise that resolves to an array of Message objects found in the storage.
     */
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
      return messages;
    }
  }
  