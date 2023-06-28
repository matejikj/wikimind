import { rdf_type } from "../LDO";
import { Link } from "../types/Link";
import { LinkType } from "../types/LinkType";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

/**
 * Represents a Linked Data Object (LDO) for a link.
 */
export class LinkLDO extends BaseLDO<Link> implements CRUDLDO<Link> {
    /**
     * Reads the provided Linked Data Object (LDO) and returns a Link object.
     * @param thing The Linked Data Object (LDO) to read.
     * @returns The Link object.
     */
    read(thing: any): Link {
        const str = getStringNoLocale(thing, (this.rdf.properties.linkType))! as unknown as LinkType;
        return {
            url: getStringNoLocale(thing, (this.rdf.properties.url))!,
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
            linkType: str,
        };
    }

    /**
     * Creates a new Linked Data Object (LDO) from the provided Link object.
     * @param object The Link object to create.
     * @returns The newly created ThingLocal instance representing the Link object.
     */
    create(object: Link): ThingLocal {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(rdf_type, this.rdf.identity)
            .addStringNoLocale((this.rdf.properties.id), object.id)
            .addStringNoLocale((this.rdf.properties.url), object.url)
            .addStringNoLocale((this.rdf.properties.linkType), object.linkType.toString())
            .build();
        return newThing;
    }
}
