import { LDOIRI } from "../LDOIRI";
import { Exam } from "../types/Exam";
import { Message } from "../types/Message";
import { Node } from "../types/Node";
import { Profile } from "../types/Profile";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, getStringNoLocale, getInteger, createThing } from "@inrupt/solid-client";

export class MessageLDO extends BaseLDO<Message> implements CRUDLDO<Message> {
    read(thing: any): Message {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            from: getStringNoLocale(thing, (this.rdf.properties.from as LDOIRI).vocabulary)!,
            to: getStringNoLocale(thing, (this.rdf.properties.to as LDOIRI).vocabulary)!,
            text: getStringNoLocale(thing, (this.rdf.properties.text as LDOIRI).vocabulary)!,
            date: getStringNoLocale(thing, (this.rdf.properties.date as LDOIRI).vocabulary)!,
        }
    };

    create(object: Message) {
        const newThing: ThingLocal = buildThing(createThing({ name: "Wikie" }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addStringNoLocale((this.rdf.properties.id as LDOIRI).vocabulary,
                object.id)
            .addStringNoLocale((this.rdf.properties.date as LDOIRI).vocabulary,
                object.date)
            .addStringNoLocale((this.rdf.properties.text as LDOIRI).vocabulary,
                object.text)
            .addStringNoLocale((this.rdf.properties.from as LDOIRI).vocabulary,
                object.from)
            .addStringNoLocale((this.rdf.properties.to as LDOIRI).vocabulary,
                object.to)
            .build();
        return newThing;
    }
}
