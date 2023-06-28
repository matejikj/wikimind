import { rdf_type } from "../LDO";
import { Grant } from "../types/Grant";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

export class ClassRequestGrantLDO extends BaseLDO<Grant> implements CRUDLDO<Grant> {
    read(thing: any): Grant {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
            class: getStringNoLocale(thing, (this.rdf.properties.class))!,
        }
    }

    create(object: Grant) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(rdf_type, this.rdf.identity)
            .addStringNoLocale((this.rdf.properties.id),
                object.id)
            .addStringNoLocale((this.rdf.properties.class),
                object.class)
            .build();
        return newThing;
    }
}
