import { LDOIRI } from "../LDOIRI";
import { Class } from "../types/Class";
import { DatasetLink } from "../types/DatasetLink";
import { LinkType } from "../types/LinkType";
import { Node } from "../types/Node";
import { Profile } from "../types/Profile";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, getStringNoLocale, getInteger, createThing } from "@inrupt/solid-client";

export class DatasetLinkLDO extends BaseLDO<DatasetLink> implements CRUDLDO<DatasetLink> {
    read(thing: any): DatasetLink {
        const str = getStringNoLocale(thing, (this.rdf.properties.linkType as LDOIRI).vocabulary)! as unknown as LinkType
        return {
            url: getStringNoLocale(thing, (this.rdf.properties.url as LDOIRI).vocabulary)!,
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            linkType: str,
        }
    };

    create(object: DatasetLink) {
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
