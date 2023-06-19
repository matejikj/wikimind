import { LDOIRI } from "../LDOIRI";
import { Chat } from "../types/Chat";
import { Exam } from "../types/Exam";
import { Message } from "../types/Message";
import { Node } from "../types/Node";
import { Profile } from "../types/Profile";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, getStringNoLocale, getInteger, createThing } from "@inrupt/solid-client";

export class ChatLDO extends BaseLDO<Chat> implements CRUDLDO<Chat> {
    read(thing: any): Chat {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            owner: getStringNoLocale(thing, (this.rdf.properties.owner as LDOIRI).vocabulary)!,
            storage: getStringNoLocale(thing, (this.rdf.properties.storage as LDOIRI).vocabulary)!,
            modified: getStringNoLocale(thing, (this.rdf.properties.modified as LDOIRI).vocabulary)!,
            lastMessage: getStringNoLocale(thing, (this.rdf.properties.lastMessage as LDOIRI).vocabulary)!,
            guest: getStringNoLocale(thing, (this.rdf.properties.guest as LDOIRI).vocabulary)!,
        }
    };

    create(object: Chat) {
        const newThing: ThingLocal = buildThing(createThing({ name: "Wikie" }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addStringNoLocale((this.rdf.properties.id as LDOIRI).vocabulary,
                object.id)
            .addStringNoLocale((this.rdf.properties.owner as LDOIRI).vocabulary,
                object.owner)
            .addStringNoLocale((this.rdf.properties.guest as LDOIRI).vocabulary,
                object.guest)
            .addStringNoLocale((this.rdf.properties.storage as LDOIRI).vocabulary,
                object.storage)
            .addStringNoLocale((this.rdf.properties.modified as LDOIRI).vocabulary,
                object.modified)
            .addStringNoLocale((this.rdf.properties.lastMessage as LDOIRI).vocabulary,
                object.lastMessage)
            .build();
        return newThing;
    }
}
