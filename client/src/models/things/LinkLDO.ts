import { LDOIRI } from "../LDOIRI";
import { Link } from "../types/Link";
import { Node } from "../types/Node";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing } from "@inrupt/solid-client";

export class LinkLDO extends BaseLDO<Link> implements CRUDLDO<Link> {
    read = (thing: ThingLocal) => {
        
    };

    create(object: Link) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addStringNoLocale((this.rdf.properties.from as LDOIRI).vocabulary, object.from)
            .addStringNoLocale((this.rdf.properties.to as LDOIRI).vocabulary, object.to)
            .addStringNoLocale((this.rdf.properties.title as LDOIRI).vocabulary, object.title)
            .build();
        return newThing;
    }
}
