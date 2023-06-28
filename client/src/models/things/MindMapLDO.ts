import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";
import { MindMap } from "../types/MindMap";
import { rdf_type } from "../LDO";

/**
 * Represents a Linked Data Object (LDO) for a mind map.
 */
export class MindMapLDO extends BaseLDO<MindMap> implements CRUDLDO<MindMap> {
    /**
     * Reads the provided Linked Data Object (LDO) and returns a MindMap object.
     * @param thing The Linked Data Object (LDO) to read.
     * @returns The MindMap object.
     */
    read(thing: any): MindMap {
        return {
            id: getStringNoLocale(thing, this.rdf.properties.id)!,
            created: getStringNoLocale(thing, this.rdf.properties.created)!,
        };
    }

    /**
     * Creates a new Linked Data Object (LDO) from the provided MindMap object.
     * @param object The MindMap object to create.
     * @returns The newly created ThingLocal instance representing the MindMap object.
     */
    create(object: MindMap) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(rdf_type, this.rdf.identity)
            .addStringNoLocale(this.rdf.properties.id, object.id)
            .addStringNoLocale(this.rdf.properties.created, object.created)
            .build();
        return newThing;
    }
}
