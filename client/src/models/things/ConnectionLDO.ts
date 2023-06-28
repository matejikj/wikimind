import { rdf_type } from "../LDO";
import { LDOIRI } from "../LDOIRI";
import { Connection } from "../types/Connection";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getBoolean, getStringNoLocale } from "@inrupt/solid-client";

export class ConnectionLDO extends BaseLDO<Connection> implements CRUDLDO<Connection> {
    read(thing: any): Connection {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
            to: getStringNoLocale(thing, (this.rdf.properties.to))!,
            from: getStringNoLocale(thing, (this.rdf.properties.from))!,
            title: getStringNoLocale(thing, (this.rdf.properties.title))!,
            testable: getBoolean(thing, (this.rdf.properties.testable))!,
        }
    }

    create(object: Connection) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
        .addUrl(rdf_type, this.rdf.identity)
        .addStringNoLocale((this.rdf.properties.from), object.from)
        .addBoolean((this.rdf.properties.testable), object.testable)
            .addStringNoLocale((this.rdf.properties.to), object.to)
            .addStringNoLocale((this.rdf.properties.id), object.id)
            .addStringNoLocale((this.rdf.properties.title), object.title)
            .build();
        return newThing;
    }
}
