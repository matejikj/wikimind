import { rdf_type } from "../LDO";
import { Request } from "../types/Request";
import { RequestType } from "../enums/RequestType";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

/**
 * Represents a Class Request Linked Data Object (LDO) extending the BaseLDO class.
 * Provides CRUD operations for Request objects related to classes.
 */
export class RequestLDO extends BaseLDO<Request> implements CRUDLDO<Request> {
  /**
   * Reads the provided Linked Data Object (LDO) and returns a Request object.
   * @param thing The Linked Data Object (LDO) to read.
   * @returns The Request object.
   */
  read(thing: any): Request {
    const str = getStringNoLocale(thing, (this.rdf.properties.requestType))! as unknown as RequestType;

    return {
      id: getStringNoLocale(thing, this.rdf.properties.id)!,
      subject: getStringNoLocale(thing, this.rdf.properties.subject)!,
      requestor: getStringNoLocale(thing, this.rdf.properties.requestor)!,
      requestType: str
    };
  }

  /**
   * Creates a new Linked Data Object (LDO) from the provided Request object.
   * @param object The Request object to create.
   * @returns The newly created ThingLocal instance representing the Request object.
   */
  create(object: Request): ThingLocal {
    const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
      .addUrl(rdf_type, this.rdf.identity)
      .addStringNoLocale(this.rdf.properties.id, object.id)
      .addStringNoLocale(this.rdf.properties.subject, object.subject)
      .addStringNoLocale(this.rdf.properties.requestor, object.requestor.toString())
      .addStringNoLocale((this.rdf.properties.requestType), object.requestType.toString())
      .build();
    return newThing;
  }

}
