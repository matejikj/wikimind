import { LDOIRI } from "../LDOIRI";
import { Node } from "../types/Node";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, getStringNoLocale, createThing } from "@inrupt/solid-client";

export class NodeLDO extends BaseLDO<Node> implements CRUDLDO<Node> {
    read(thing: any): Node {
        const b = getStringNoLocale(thing, "http://schema.org/alternateName")
        console.log(b)
        const a: Node = {
            cx: 54,
            cy: 12,
            title: "fdsa",
            description: "fsda",
            id: "fdas"
        }
        return a;
    };
    create(object: Node) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addInteger((this.rdf.properties.cx as LDOIRI).vocabulary, object.cx)
            .addInteger((this.rdf.properties.cy as LDOIRI).vocabulary, object.cx)
            .addStringNoLocale((this.rdf.properties.description as LDOIRI).vocabulary,
                object.description)
            .addStringNoLocale((this.rdf.properties.title as LDOIRI).vocabulary,
                object.title)
            .build();
        return newThing;
    }
}
