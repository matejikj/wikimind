import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";

import {
    ThingLocal,
    buildThing,
    createThing,
    getStringNoLocale,
} from "@inrupt/solid-client";

import { MindMap } from "../types/MindMap";
import { LDOIRI } from '../LDOIRI'

export class MindMapLDO extends BaseLDO<MindMap> implements CRUDLDO<MindMap> {
    read(thing: any): MindMap {

        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            created: getStringNoLocale(thing, (this.rdf.properties.created as LDOIRI).vocabulary)!,
        }
    }

    create(object: MindMap) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addStringNoLocale((this.rdf.properties.id as LDOIRI).vocabulary, object.id)
            .addStringNoLocale((this.rdf.properties.created as LDOIRI).vocabulary, object.created)
            .build();
        return newThing;
    }
}
