import { LDOIRI } from "../LDOIRI";
import { Class } from "../types/Class";
import { ClassRequest } from "../types/ClassRequest";
import { ClassRequestGrant } from "../types/ClassRequestGrant";
import { DatasetLink } from "../types/DatasetLink";
import { LinkType } from "../types/LinkType";
import { Node } from "../types/Node";
import { Profile } from "../types/Profile";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, getStringNoLocale, getInteger, createThing } from "@inrupt/solid-client";

export class ClassRequestGrantLDO extends BaseLDO<ClassRequestGrant> implements CRUDLDO<ClassRequestGrant> {
    read(thing: any): ClassRequestGrant {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            class: getStringNoLocale(thing, (this.rdf.properties.class as LDOIRI).vocabulary)!,
        }
    };

    create(object: ClassRequestGrant) {
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
