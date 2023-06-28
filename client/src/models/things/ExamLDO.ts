import { rdf_type } from "../LDO";
import { Exam } from "../types/Exam";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getInteger, getStringNoLocale } from "@inrupt/solid-client";

export class ExamLDO extends BaseLDO<Exam> implements CRUDLDO<Exam> {
    read(thing: any): Exam {
        return {
            max: getInteger(thing, (this.rdf.properties.max))!,
            result: getInteger(thing, (this.rdf.properties.result))!,
            mindMap: getStringNoLocale(thing, (this.rdf.properties.mindMap))!,
            profile: getStringNoLocale(thing, (this.rdf.properties.profile))!,
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
        }
    }

    create(object: Exam) {
        const newThing: ThingLocal = buildThing(createThing({ name: "Wikie" }))
            .addUrl(rdf_type, this.rdf.identity)
            .addInteger((this.rdf.properties.max),
                object.max)
            .addInteger((this.rdf.properties.result),
                object.result)
                .addStringNoLocale((this.rdf.properties.profile),
                object.profile)
                .addStringNoLocale((this.rdf.properties.id),
                object.id)
            .addStringNoLocale((this.rdf.properties.mindMap),
                object.mindMap)
            .build();
        return newThing;
    }
}
