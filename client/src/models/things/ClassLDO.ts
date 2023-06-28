import { LDOIRI } from "../LDOIRI";
import { Class } from "../types/Class";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

export class ClassLDO extends BaseLDO<Class> implements CRUDLDO<Class> {
    read(thing: any): Class {
        return {
            name: getStringNoLocale(thing, (this.rdf.properties.name as LDOIRI).vocabulary)!,
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            teacher: getStringNoLocale(thing, (this.rdf.properties.teacher as LDOIRI).vocabulary)!,
            storage: getStringNoLocale(thing, (this.rdf.properties.storage as LDOIRI).vocabulary)!,
        }
    }

    create(object: Class) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addStringNoLocale((this.rdf.properties.id as LDOIRI).vocabulary,
                object.id)
            .addStringNoLocale((this.rdf.properties.name as LDOIRI).vocabulary,
                object.name)
            .addStringNoLocale((this.rdf.properties.teacher as LDOIRI).vocabulary,
                object.teacher)
            .addStringNoLocale((this.rdf.properties.storage as LDOIRI).vocabulary,
                object.storage)
            .build();
        return newThing;
    }
}
