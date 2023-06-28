import { rdf_type } from "../LDO";
import { Link } from "../types/Link";
import { LinkType } from "../types/LinkType";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

export class DatasetLinkLDO extends BaseLDO<Link> implements CRUDLDO<Link> {
    read(thing: any): Link {
        const str = getStringNoLocale(thing, (this.rdf.properties.linkType))! as unknown as LinkType
        return {
            url: getStringNoLocale(thing, (this.rdf.properties.url))!,
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
            linkType: str,
        }
    }

    create(object: Link) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(rdf_type, this.rdf.identity)
            .addStringNoLocale((this.rdf.properties.id),
                object.id)
            .addStringNoLocale((this.rdf.properties.url),
                object.url)
            .addStringNoLocale((this.rdf.properties.linkType),
                object.linkType.toString())
            .build();
        return newThing;
    }
}
