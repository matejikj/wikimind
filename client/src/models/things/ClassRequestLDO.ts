import { LDOIRI } from "../LDOIRI";
import { Class } from "../types/Class";
import { ClassRequest } from "../types/ClassRequest";
import { DatasetLink } from "../types/DatasetLink";
import { LinkType } from "../types/LinkType";
import { Node } from "../types/Node";
import { Profile } from "../types/Profile";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, getStringNoLocale, getInteger, createThing } from "@inrupt/solid-client";

export class ClassRequestLDO extends BaseLDO<ClassRequest> implements CRUDLDO<ClassRequest> {
    read(thing: any): ClassRequest {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            class: getStringNoLocale(thing, (this.rdf.properties.class as LDOIRI).vocabulary)!,
            requestor: getStringNoLocale(thing, (this.rdf.properties.requestor as LDOIRI).vocabulary)!,
        }
    };

    create(object: ClassRequest) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addStringNoLocale((this.rdf.properties.id as LDOIRI).vocabulary,
                object.id)
            .addStringNoLocale((this.rdf.properties.class as LDOIRI).vocabulary,
                object.class)
            .addStringNoLocale((this.rdf.properties.requestor as LDOIRI).vocabulary,
                object.requestor.toString())
            .build();
        return newThing;
    }
}
