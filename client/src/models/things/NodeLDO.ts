import { rdf_type } from "../LDO";
import { LDOIRI } from "../LDOIRI";
import { Node } from "../types/Node";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getBoolean, getInteger, getStringNoLocale } from "@inrupt/solid-client";

export class NodeLDO extends BaseLDO<Node> implements CRUDLDO<Node> {
    read(thing: any): Node {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
            cx: getInteger(thing, (this.rdf.properties.cx))!,
            cy: getInteger(thing, (this.rdf.properties.cy))!,
            title: getStringNoLocale(thing, (this.rdf.properties.title))!,
            uri: getStringNoLocale(thing, (this.rdf.properties.uri))!,
            description: getStringNoLocale(thing, (this.rdf.properties.description))!,
            visible: getBoolean(thing, (this.rdf.properties.visible))!
        }
    }

    create(object: Node) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(rdf_type, this.rdf.identity)
            .addInteger((this.rdf.properties.cx), Math.floor(object.cx))
            .addBoolean((this.rdf.properties.visible), object.visible)
            .addInteger((this.rdf.properties.cy), Math.floor(object.cy))
            .addStringNoLocale((this.rdf.properties.description),
                object.description)
            .addStringNoLocale((this.rdf.properties.id),
                object.id)
            .addStringNoLocale((this.rdf.properties.uri),
                object.uri)
            .addStringNoLocale((this.rdf.properties.title),
                object.title)
            .build();
        return newThing;
    }
}
