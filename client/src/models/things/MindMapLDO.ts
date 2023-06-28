import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";

import {
    ThingLocal,
    buildThing,
    createThing,
    getStringNoLocale,
} from "@inrupt/solid-client";

import { MindMap } from "../types/MindMap";
import { rdf_type } from "../LDO";

export class MindMapLDO extends BaseLDO<MindMap> implements CRUDLDO<MindMap> {
    read(thing: any): MindMap {

        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
            created: getStringNoLocale(thing, (this.rdf.properties.created))!,
        }
    }

    create(object: MindMap) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(rdf_type, this.rdf.identity)
            .addStringNoLocale((this.rdf.properties.id), object.id)
            .addStringNoLocale((this.rdf.properties.created), object.created)
            .build();
        return newThing;
    }
}
