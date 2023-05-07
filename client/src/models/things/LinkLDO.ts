import { LDOIRI } from "../LDOIRI";
import { Link } from "../types/Link";
import { Node } from "../types/Node";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

export class LinkLDO extends BaseLDO<Link> implements CRUDLDO<Link> {
    read(thing: any): Link {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            to: getStringNoLocale(thing, (this.rdf.properties.to as LDOIRI).vocabulary)!,
            from: getStringNoLocale(thing, (this.rdf.properties.from as LDOIRI).vocabulary)!,
            title: getStringNoLocale(thing, (this.rdf.properties.title as LDOIRI).vocabulary)!,
        }
    };

    create(object: Link) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.title }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addStringNoLocale((this.rdf.properties.from as LDOIRI).vocabulary, object.from)
            .addStringNoLocale((this.rdf.properties.to as LDOIRI).vocabulary, object.to)
            .build();
        return newThing;
    }
}
