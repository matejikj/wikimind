import {
  ThingLocal,
  buildThing,
  createThing,
  getStringNoLocale
} from "@inrupt/solid-client";
import requestDefinition from "../../definitions/request.json";
import { RequestType } from "../../models/enums/RequestType";
import { RequestLDO } from "../../models/things/RequestLDO";
import { Request } from "../../models/types/Request";

describe("RequestLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const requestLDO = new RequestLDO(requestDefinition);

  test("should read a Request object from a Linked Data Object", () => {
    const requestLDOData: any = {
      id: "request123",
      subject: "https://example.com/resource123",
      requestor: "https://example.com/user456",
      requestType: "read",
    };

    const ldoThing: ThingLocal = buildThing(createThing({ name: requestLDOData.id }))
      .addStringNoLocale(requestDefinition.properties.id, requestLDOData.id)
      .addStringNoLocale(requestDefinition.properties.subject, requestLDOData.subject)
      .addStringNoLocale(requestDefinition.properties.requestor, requestLDOData.requestor)
      .addStringNoLocale(requestDefinition.properties.requestType, requestLDOData.requestType)
      .build();
    const request: Request = requestLDO.read(ldoThing);
    expect(request).toEqual(requestLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Request object", () => {
    const request: Request = {
      id: "request456",
      subject: "https://example.com/resource789",
      requestor: "https://example.com/user123",
      requestType: RequestType.ADD_CLASS,
    };

    const ldoThing: ThingLocal = requestLDO.create(request);
    expect(ldoThing.url).toBe(`${rdfIdentity}request456`);
    expect(getStringNoLocale(ldoThing, requestDefinition.properties.id)).toBe(request.id);
    expect(getStringNoLocale(ldoThing, requestDefinition.properties.subject)).toBe(request.subject);
    expect(getStringNoLocale(ldoThing, requestDefinition.properties.requestor)).toBe(request.requestor);
    expect(getStringNoLocale(ldoThing, requestDefinition.properties.requestType)).toBe(request.requestType.toString());
  });
});
