import { LDOIRI } from "../LDOIRI";
import { Node } from "../types/Node";
import { Profile } from "../types/Profile";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, getStringNoLocale, getInteger, createThing } from "@inrupt/solid-client";

export class ProfileLDO extends BaseLDO<Profile> implements CRUDLDO<Profile> {
    read(thing: any): Profile {
        return {
            name: getStringNoLocale(thing, (this.rdf.properties.name as LDOIRI).vocabulary)!,
            surname: getStringNoLocale(thing, (this.rdf.properties.surname as LDOIRI).vocabulary)!,
            webId: getStringNoLocale(thing, (this.rdf.properties.webId as LDOIRI).vocabulary)!
        }
    };

    create(object: Profile) {
        const newThing: ThingLocal = buildThing(createThing({ name: "Wikie" }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addStringNoLocale((this.rdf.properties.name as LDOIRI).vocabulary,
                object.name)
            .addStringNoLocale((this.rdf.properties.webId as LDOIRI).vocabulary,
                object.webId)
            .addStringNoLocale((this.rdf.properties.surname as LDOIRI).vocabulary,
                object.surname)
            .build();
        return newThing;
    }
}
