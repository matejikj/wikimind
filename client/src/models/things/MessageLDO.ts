import { rdf_type } from "../LDO";
import { Message } from "../types/Message";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

export class MessageLDO extends BaseLDO<Message> implements CRUDLDO<Message> {
    read(thing: any): Message {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
            from: getStringNoLocale(thing, (this.rdf.properties.from))!,
            to: getStringNoLocale(thing, (this.rdf.properties.to))!,
            text: getStringNoLocale(thing, (this.rdf.properties.text))!,
            date: getStringNoLocale(thing, (this.rdf.properties.date))!,
        }
    }

    create(object: Message) {
        const newThing: ThingLocal = buildThing(createThing({ name: "Wikie" }))
            .addUrl(rdf_type, this.rdf.identity)
            .addStringNoLocale((this.rdf.properties.id),
                object.id)
            .addStringNoLocale((this.rdf.properties.date),
                object.date)
            .addStringNoLocale((this.rdf.properties.text),
                object.text)
            .addStringNoLocale((this.rdf.properties.from),
                object.from)
            .addStringNoLocale((this.rdf.properties.to),
                object.to)
            .build();
        return newThing;
    }
}
