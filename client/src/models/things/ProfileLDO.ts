import { rdf_type } from "../LDO";
import { Profile } from "../types/Profile";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

export class ProfileLDO extends BaseLDO<Profile> implements CRUDLDO<Profile> {
    read(thing: any): Profile {
        return {
            name: getStringNoLocale(thing, (this.rdf.properties.name))!,
            surname: getStringNoLocale(thing, (this.rdf.properties.surname))!,
            webId: getStringNoLocale(thing, (this.rdf.properties.webId))!,
            profileImage: getStringNoLocale(thing, (this.rdf.properties.profileImage))!
        }
    }

    create(object: Profile) {
        const newThing: ThingLocal = buildThing(createThing({ name: "Wikie" }))
            .addUrl(rdf_type, this.rdf.identity)
            .addStringNoLocale((this.rdf.properties.name),
                object.name)
            .addStringNoLocale((this.rdf.properties.webId),
                object.webId)
            .addStringNoLocale((this.rdf.properties.surname),
                object.surname)
            .addStringNoLocale((this.rdf.properties.profileImage),
                object.profileImage)
            .build();
        return newThing;
    }
}
