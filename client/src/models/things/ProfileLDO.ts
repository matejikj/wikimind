import { WIKIMIND } from "../../service/containerService";
import { rdf_type } from "../LDO";
import { Profile } from "../types/Profile";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

/**
 * Represents a Linked Data Object (LDO) for a profile.
 */
export class ProfileLDO extends BaseLDO<Profile> implements CRUDLDO<Profile> {
    /**
     * Reads the provided Linked Data Object (LDO) and returns a Profile object.
     * @param thing The Linked Data Object (LDO) to read.
     * @returns The Profile object.
     */
    read(thing: any): Profile {
        return {
            name: getStringNoLocale(thing, this.rdf.properties.name)!,
            surname: getStringNoLocale(thing, this.rdf.properties.surname)!,
            webId: getStringNoLocale(thing, this.rdf.properties.webId)!,
            ownerPod: getStringNoLocale(thing, this.rdf.properties.ownerPod)!,
        };
    }

    /**
     * Creates a new Linked Data Object (LDO) from the provided Profile object.
     * @param object The Profile object to create.
     * @returns The newly created ThingLocal instance representing the Profile object.
     */
    create(object: Profile) {
        const newThing: ThingLocal = buildThing(createThing({ name: WIKIMIND }))
            .addUrl(rdf_type, this.rdf.identity)
            .addStringNoLocale(this.rdf.properties.name, object.name)
            .addStringNoLocale(this.rdf.properties.webId, object.webId)
            .addStringNoLocale(this.rdf.properties.surname, object.surname)
            .addStringNoLocale(this.rdf.properties.ownerPod, object.ownerPod)
            .build();
        return newThing;
    }
}
