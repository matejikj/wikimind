import {
  ThingLocal,
  buildThing,
  createThing,
  setStringNoLocale,
  getStringNoLocale,
} from "@inrupt/solid-client";
import { RequestLDO } from "../RequestLDO";
import { Request } from "../../types/Request";
import { RequestType } from "../../enums/RequestType";
import requestDefinition from "../../../definitions/request.json";

describe("RequestLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const requestLDO = new RequestLDO(requestDefinition);

  test("should read a Request object from a Linked Data Object", () => {
    // Prepare the Linked Data Object (LDO) with request data
    const requestLDOData: any = {
      id: "request123",
      subject: "https://example.com/resource123",
      requestor: "https://example.com/user456",
      requestType: "read", // Assuming RequestType is a string enum with values like "read", "write", etc.
    };

    // Create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = buildThing(createThing({ name: requestLDOData.id }))
      .addStringNoLocale(requestDefinition.properties.id, requestLDOData.id)
      .addStringNoLocale(requestDefinition.properties.subject, requestLDOData.subject)
      .addStringNoLocale(requestDefinition.properties.requestor, requestLDOData.requestor)
      .addStringNoLocale(requestDefinition.properties.requestType, requestLDOData.requestType)
      .build();

    // Call the read method to convert the LDO to a Request object
    const request: Request = requestLDO.read(ldoThing);

    // Check if the Request object matches the input data
    expect(request).toEqual(requestLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Request object", () => {
    // Prepare the Request object
    const request: Request = {
      id: "request456",
      subject: "https://example.com/resource789",
      requestor: "https://example.com/user123",
      requestType: RequestType.ADD_CLASS, // Assuming RequestType is an enum with values like Read, Write, etc.
    };

    // Call the create method to create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = requestLDO.create(request);

    // Check if the created ThingLocal contains the correct values
    expect(ldoThing.url).toBe(`${rdfIdentity}request456`);
    expect(getStringNoLocale(ldoThing, requestDefinition.properties.id)).toBe(request.id);
    expect(getStringNoLocale(ldoThing, requestDefinition.properties.subject)).toBe(request.subject);
    expect(getStringNoLocale(ldoThing, requestDefinition.properties.requestor)).toBe(request.requestor);
    expect(getStringNoLocale(ldoThing, requestDefinition.properties.requestType)).toBe(request.requestType.toString());
  });
});
