import { rdf_type } from "../LDO";
import { Node } from "../types/Node";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getBoolean, getInteger, getStringNoLocale } from "@inrupt/solid-client";

/**
 * Represents a Linked Data Object (LDO) for a node.
 */
export class NodeLDO extends BaseLDO<Node> implements CRUDLDO<Node> {
    /**
     * Reads the provided Linked Data Object (LDO) and returns a Node object.
     * @param thing The Linked Data Object (LDO) to read.
     * @returns The Node object.
     */
    read(thing: any): Node {
        return {
            id: getStringNoLocale(thing, this.rdf.properties.id)!,
            cx: getInteger(thing, this.rdf.properties.cx)!,
            cy: getInteger(thing, this.rdf.properties.cy)!,
            title: getStringNoLocale(thing, this.rdf.properties.title)!,
            uri: getStringNoLocale(thing, this.rdf.properties.uri)!,
            description: getStringNoLocale(thing, this.rdf.properties.description)!,
            textColor: getStringNoLocale(thing, this.rdf.properties.textColor)!,
            color: getStringNoLocale(thing, this.rdf.properties.color)!,
            isInTest: getBoolean(thing, this.rdf.properties.isInTest)!
        };
    }

    /**
     * Creates a new Linked Data Object (LDO) from the provided Node object.
     * @param object The Node object to create.
     * @returns The newly created ThingLocal instance representing the Node object.
     */
    create(object: Node) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(rdf_type, this.rdf.identity)
            .addInteger(this.rdf.properties.cx, Math.floor(object.cx))
            .addBoolean(this.rdf.properties.isInTest, object.isInTest)
            .addInteger(this.rdf.properties.cy, Math.floor(object.cy))
            .addStringNoLocale(this.rdf.properties.description, object.description)
            .addStringNoLocale(this.rdf.properties.color, object.color)
            .addStringNoLocale(this.rdf.properties.textColor, object.textColor)
            .addStringNoLocale(this.rdf.properties.id, object.id)
            .addStringNoLocale(this.rdf.properties.uri, object.uri)
            .addStringNoLocale(this.rdf.properties.title, object.title)
            .build();
        return newThing;
    }
}
