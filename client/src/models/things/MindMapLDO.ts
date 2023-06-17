import { Node } from "../types/Node";
import { BaseLDO } from "./BaseLDO";
import { LDO } from "../LDO";
import { CRUDLDO } from "./CRUDLDO";
import mindMapDefinition from "../../definitions/mindMapMetaData.json"

import {
    addUrl,
    getThing,
    getSolidDataset,
    addStringNoLocale,
    buildThing,
    createSolidDataset,
    createThing,
    setThing,
    createContainerAt,
    getStringNoLocale,
    saveSolidDatasetAt,
    ThingLocal,
    getUrl,
    getLiteral,
    getUrlAll
} from "@inrupt/solid-client";

import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";
import { MindMap } from "../types/MindMap";
import { NodeLDO } from "./NodeLDO";
import { addAbortSignal } from "stream";
import { LDOIRI } from '../LDOIRI'
import { Connection } from "../types/Connection";
import { ConnectionLDO } from "./ConnectionLDO";

export class MindMapLDO extends BaseLDO<MindMap> implements CRUDLDO<MindMap> {
    read(thing: any): MindMap {

        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            title: getStringNoLocale(thing, (this.rdf.properties.title as LDOIRI).vocabulary)!,
            acccessType: getStringNoLocale(thing, (this.rdf.properties.acccessType as LDOIRI).vocabulary)!,
            created: getStringNoLocale(thing, (this.rdf.properties.created as LDOIRI).vocabulary)!,
            url: getStringNoLocale(thing, (this.rdf.properties.url as LDOIRI).vocabulary)!,
        }
    };

    create(object: MindMap) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addStringNoLocale((this.rdf.properties.id as LDOIRI).vocabulary, object.id)
            .addStringNoLocale((this.rdf.properties.title as LDOIRI).vocabulary, object.title)
            .addStringNoLocale((this.rdf.properties.created as LDOIRI).vocabulary, object.created)
            .addStringNoLocale((this.rdf.properties.acccessType as LDOIRI).vocabulary, object.acccessType)
            .addStringNoLocale((this.rdf.properties.url as LDOIRI).vocabulary, object.url)
            .build();
        return newThing;
    };
}
