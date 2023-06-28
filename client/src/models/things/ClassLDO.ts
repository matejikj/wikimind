import { rdf_type } from "../LDO";
import { Class } from "../types/Class";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

export class ClassLDO extends BaseLDO<Class> implements CRUDLDO<Class> {
    read(thing: any): Class {
        return {
            name: getStringNoLocale(thing, (this.rdf.properties.name))!,
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
            teacher: getStringNoLocale(thing, (this.rdf.properties.teacher))!,
            storage: getStringNoLocale(thing, (this.rdf.properties.storage))!,
        }
    }

    create(object: Class) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(rdf_type, this.rdf.identity)
            .addStringNoLocale((this.rdf.properties.id),
                object.id)
            .addStringNoLocale((this.rdf.properties.name),
                object.name)
            .addStringNoLocale((this.rdf.properties.teacher),
                object.teacher)
            .addStringNoLocale((this.rdf.properties.storage),
                object.storage)
            .build();
        return newThing;
    }
}
