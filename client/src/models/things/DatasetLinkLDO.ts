import { LDOIRI } from "../LDOIRI";
import { Link } from "../types/Link";
import { LinkType } from "../types/LinkType";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

export class DatasetLinkLDO extends BaseLDO<Link> implements CRUDLDO<Link> {
    read(thing: any): Link {
        const str = getStringNoLocale(thing, (this.rdf.properties.linkType as LDOIRI).vocabulary)! as unknown as LinkType
        return {
            url: getStringNoLocale(thing, (this.rdf.properties.url as LDOIRI).vocabulary)!,
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            linkType: str,
        }
    }

    create(object: Link) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addStringNoLocale((this.rdf.properties.id as LDOIRI).vocabulary,
                object.id)
            .addStringNoLocale((this.rdf.properties.url as LDOIRI).vocabulary,
                object.url)
            .addStringNoLocale((this.rdf.properties.linkType as LDOIRI).vocabulary,
                object.linkType.toString())
            .build();
        return newThing;
    }
}
