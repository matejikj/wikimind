import { rdf_type } from "../LDO";
import { Chat } from "../types/Chat";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

/**
 * Represents a Chat Linked Data Object (LDO) extending the BaseLDO class.
 * Provides CRUD operations for Chat objects.
 */
export class ChatLDO extends BaseLDO<Chat> implements CRUDLDO<Chat> {
  /**
   * Reads the provided Linked Data Object (LDO) and returns a Chat object.
   * @param thing The Linked Data Object (LDO) to read.
   * @returns The Chat object.
   */
  read(thing: any): Chat {
    return {
      id: getStringNoLocale(thing, this.rdf.properties.id)!,
      host: getStringNoLocale(thing, this.rdf.properties.host)!,
      ownerPod: getStringNoLocale(thing, this.rdf.properties.ownerPod)!,
      storage: getStringNoLocale(thing, this.rdf.properties.storage)!,
      modified: getStringNoLocale(thing, this.rdf.properties.modified)!,
      lastMessage: getStringNoLocale(thing, this.rdf.properties.lastMessage)!,
      guest: getStringNoLocale(thing, this.rdf.properties.guest)!,
    };
  }

  /**
   * Creates a new Linked Data Object (LDO) from the provided Chat object.
   * @param object The Chat object to create.
   * @returns The newly created ThingLocal instance representing the Chat object.
   */
  create(object: Chat): ThingLocal {
    const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
      .addUrl(rdf_type, this.rdf.identity)
      .addStringNoLocale(this.rdf.properties.id, object.id)
      .addStringNoLocale(this.rdf.properties.host, object.host)
      .addStringNoLocale(this.rdf.properties.ownerPod, object.ownerPod)
      .addStringNoLocale(this.rdf.properties.guest, object.guest)
      .addStringNoLocale(this.rdf.properties.storage, object.storage)
      .addStringNoLocale(this.rdf.properties.modified, object.modified)
      .addStringNoLocale(this.rdf.properties.lastMessage, object.lastMessage)
      .build();
    return newThing;
  }
}
