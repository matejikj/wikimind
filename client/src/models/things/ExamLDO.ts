import { LDOIRI } from "../LDOIRI";
import { Exam } from "../types/Exam";
import { Node } from "../types/Node";
import { Profile } from "../types/Profile";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, getStringNoLocale, getInteger, createThing } from "@inrupt/solid-client";

export class ExamLDO extends BaseLDO<Exam> implements CRUDLDO<Exam> {
    read(thing: any): Exam {
        return {
            max: getInteger(thing, (this.rdf.properties.max as LDOIRI).vocabulary)!,
            result: getInteger(thing, (this.rdf.properties.result as LDOIRI).vocabulary)!,
            mindMap: getStringNoLocale(thing, (this.rdf.properties.mindMap as LDOIRI).vocabulary)!,
            profile: getStringNoLocale(thing, (this.rdf.properties.profile as LDOIRI).vocabulary)!,
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
        }
    };

    create(object: Exam) {
        const newThing: ThingLocal = buildThing(createThing({ name: "Wikie" }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addInteger((this.rdf.properties.max as LDOIRI).vocabulary,
                object.max)
            .addInteger((this.rdf.properties.result as LDOIRI).vocabulary,
                object.result)
                .addStringNoLocale((this.rdf.properties.profile as LDOIRI).vocabulary,
                object.profile)
                .addStringNoLocale((this.rdf.properties.id as LDOIRI).vocabulary,
                object.id)
            .addStringNoLocale((this.rdf.properties.mindMap as LDOIRI).vocabulary,
                object.mindMap)
            .build();
        return newThing;
    }
}
