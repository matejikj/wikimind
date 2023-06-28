import { rdf_type } from "../LDO";
import { Chat } from "../types/Chat";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

export class ChatLDO extends BaseLDO<Chat> implements CRUDLDO<Chat> {
    read(thing: any): Chat {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
            owner: getStringNoLocale(thing, (this.rdf.properties.owner))!,
            storage: getStringNoLocale(thing, (this.rdf.properties.storage))!,
            modified: getStringNoLocale(thing, (this.rdf.properties.modified))!,
            lastMessage: getStringNoLocale(thing, (this.rdf.properties.lastMessage))!,
            guest: getStringNoLocale(thing, (this.rdf.properties.guest))!,
        }
    }

    create(object: Chat) {
        const newThing: ThingLocal = buildThing(createThing({ name: "Wikie" }))
            .addUrl(rdf_type, this.rdf.identity)
            .addStringNoLocale((this.rdf.properties.id),
                object.id)
            .addStringNoLocale((this.rdf.properties.owner),
                object.owner)
            .addStringNoLocale((this.rdf.properties.guest),
                object.guest)
            .addStringNoLocale((this.rdf.properties.storage),
                object.storage)
            .addStringNoLocale((this.rdf.properties.modified),
                object.modified)
            .addStringNoLocale((this.rdf.properties.lastMessage),
                object.lastMessage)
            .build();
        return newThing;
    }
}
