import { LDOIRI } from "../LDOIRI";
import { Connection } from "../types/Connection";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getBoolean, getStringNoLocale } from "@inrupt/solid-client";

export class ConnectionLDO extends BaseLDO<Connection> implements CRUDLDO<Connection> {
    read(thing: any): Connection {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            to: getStringNoLocale(thing, (this.rdf.properties.to as LDOIRI).vocabulary)!,
            from: getStringNoLocale(thing, (this.rdf.properties.from as LDOIRI).vocabulary)!,
            title: getStringNoLocale(thing, (this.rdf.properties.title as LDOIRI).vocabulary)!,
            testable: getBoolean(thing, (this.rdf.properties.testable as LDOIRI).vocabulary)!,
        }
    }

    create(object: Connection) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
        .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
        .addStringNoLocale((this.rdf.properties.from as LDOIRI).vocabulary, object.from)
        .addBoolean((this.rdf.properties.testable as LDOIRI).vocabulary, object.testable)
            .addStringNoLocale((this.rdf.properties.to as LDOIRI).vocabulary, object.to)
            .addStringNoLocale((this.rdf.properties.id as LDOIRI).vocabulary, object.id)
            .addStringNoLocale((this.rdf.properties.title as LDOIRI).vocabulary, object.title)
            .build();
        return newThing;
    }
}
