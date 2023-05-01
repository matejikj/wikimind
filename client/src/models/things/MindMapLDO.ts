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
} from "@inrupt/solid-client";

import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";
import { MindMap } from "../types/MindMap";
import { NodeLDO } from "./NodeLDO";
import { addAbortSignal } from "stream";
import { LDOIRI } from '../LDOIRI'
import { Link } from "../types/Link";
import { LinkLDO } from "./LinkLDO";

export class MindMapLDO extends BaseLDO<MindMap> implements CRUDLDO<MindMap> {
    create(object: MindMap) {

        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
        .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
        .addStringNoLocale((this.rdf.properties.created as LDOIRI).vocabulary, object.created)
            .addStringNoLocale((this.rdf.properties.acccessType as LDOIRI).vocabulary, object.acccessType)
            .addStringNoLocale((this.rdf.properties.title as LDOIRI).vocabulary, object.title)
            .addStringNoLocale((this.rdf.properties.url as LDOIRI).vocabulary, object.url)
            .build();
        return newThing;

    };


}
