import { rdf_type } from "../LDO";
import { Message } from "../types/Message";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, getInteger, createThing, getStringNoLocale } from "@inrupt/solid-client";

/**
 * Represents a Linked Data Object (LDO) for a message.
 */
export class MessageLDO extends BaseLDO<Message> implements CRUDLDO<Message> {
    /**
     * Reads the provided Linked Data Object (LDO) and returns a Message object.
     * @param thing The Linked Data Object (LDO) to read.
     * @returns The Message object.
     */
    read(thing: any): Message {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
            from: getStringNoLocale(thing, (this.rdf.properties.from))!,
            text: getStringNoLocale(thing, (this.rdf.properties.text))!,
            date: getInteger(thing, (this.rdf.properties.date))!,
        };
    }

    /**
     * Creates a new Linked Data Object (LDO) from the provided Message object.
     * @param object The Message object to create.
     * @returns The newly created ThingLocal instance representing the Message object.
     */
    create(object: Message) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(rdf_type, this.rdf.identity)
            .addStringNoLocale((this.rdf.properties.id), object.id)
            .addInteger((this.rdf.properties.date), object.date)
            .addStringNoLocale((this.rdf.properties.text), object.text)
            .addStringNoLocale((this.rdf.properties.from), object.from)
            .build();
        return newThing;
    }
}
