import { LDOIRI } from "../LDOIRI";
import { Node } from "../types/Node";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, getStringNoLocale, getInteger, createThing } from "@inrupt/solid-client";

export class NodeLDO extends BaseLDO<Node> implements CRUDLDO<Node> {
    read(thing: any): Node {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            cx: getInteger(thing, (this.rdf.properties.cx as LDOIRI).vocabulary)!,
            cy: getInteger(thing, (this.rdf.properties.cy as LDOIRI).vocabulary)!,
            title: getStringNoLocale(thing, (this.rdf.properties.title as LDOIRI).vocabulary)!,
            description: getStringNoLocale(thing, (this.rdf.properties.description as LDOIRI).vocabulary)!
        }
    };

    create(object: Node) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addInteger((this.rdf.properties.cx as LDOIRI).vocabulary, object.cx)
            .addInteger((this.rdf.properties.cy as LDOIRI).vocabulary, object.cx)
            .addStringNoLocale((this.rdf.properties.description as LDOIRI).vocabulary,
                object.description)
            .addStringNoLocale((this.rdf.properties.id as LDOIRI).vocabulary,
                object.id)
            .addStringNoLocale((this.rdf.properties.title as LDOIRI).vocabulary,
                object.title)
            .build();
        return newThing;
    }
}
