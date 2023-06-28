import { LDOIRI } from "../LDOIRI";
import { Grant } from "../types/Grant";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

export class ClassRequestGrantLDO extends BaseLDO<Grant> implements CRUDLDO<Grant> {
    read(thing: any): Grant {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            class: getStringNoLocale(thing, (this.rdf.properties.class as LDOIRI).vocabulary)!,
        }
    }

    create(object: Grant) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addStringNoLocale((this.rdf.properties.id as LDOIRI).vocabulary,
                object.id)
            .addStringNoLocale((this.rdf.properties.class as LDOIRI).vocabulary,
                object.class)
            .build();
        return newThing;
    }
}
