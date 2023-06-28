import { rdf_type } from "../LDO";
import { Exam } from "../types/Exam";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getInteger, getStringNoLocale } from "@inrupt/solid-client";

/**
 * Represents a Linked Data Object (LDO) for an exam.
 */
export class ExamLDO extends BaseLDO<Exam> implements CRUDLDO<Exam> {
    /**
     * Reads the provided Linked Data Object (LDO) and returns an Exam object.
     * @param thing The Linked Data Object (LDO) to read.
     * @returns The Exam object.
     */
    read(thing: any): Exam {
        return {
            max: getInteger(thing, (this.rdf.properties.max))!,
            result: getInteger(thing, (this.rdf.properties.result))!,
            mindMap: getStringNoLocale(thing, (this.rdf.properties.mindMap))!,
            profile: getStringNoLocale(thing, (this.rdf.properties.profile))!,
            id: getStringNoLocale(thing, (this.rdf.properties.id))!,
        };
    }

    /**
     * Creates a new Linked Data Object (LDO) from the provided Exam object.
     * @param object The Exam object to create.
     * @returns The newly created ThingLocal instance representing the Exam object.
     */
    create(object: Exam) {
        const newThing: ThingLocal = buildThing(createThing({ name: "Wikie" }))
            .addUrl(rdf_type, this.rdf.identity)
            .addInteger((this.rdf.properties.max), object.max)
            .addInteger((this.rdf.properties.result), object.result)
            .addStringNoLocale((this.rdf.properties.profile), object.profile)
            .addStringNoLocale((this.rdf.properties.id), object.id)
            .addStringNoLocale((this.rdf.properties.mindMap), object.mindMap)
            .build();
        return newThing;
    }
}
