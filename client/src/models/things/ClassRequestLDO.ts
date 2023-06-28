import { rdf_type } from "../LDO";
import { Request } from "../types/Request";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

export class ClassRequestLDO extends BaseLDO<Request> implements CRUDLDO<Request> {
    read(thing: any): Request {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
            class: getStringNoLocale(thing, (this.rdf.properties.class))!,
            requestor: getStringNoLocale(thing, (this.rdf.properties.requestor))!,
        }
    }

    create(object: Request) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(rdf_type, this.rdf.identity)
            .addStringNoLocale((this.rdf.properties.id),
                object.id)
            .addStringNoLocale((this.rdf.properties.class),
                object.class)
            .addStringNoLocale((this.rdf.properties.requestor),
                object.requestor.toString())
            .build();
        return newThing;
    }
}
