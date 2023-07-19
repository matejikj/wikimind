import {
  ThingLocal,
  buildThing,
  createThing,
  setStringNoLocale,
  getStringNoLocale,
} from "@inrupt/solid-client";
import { LinkLDO } from "../../models/things/LinkLDO";
import { Link } from "../../models/types/Link";
import { LinkType } from "../../models/enums/LinkType";
import linkDefinition from "../../definitions/link.json";

describe("LinkLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const linkLDO = new LinkLDO(linkDefinition);

  test("should read a Link object from a Linked Data Object", () => {
    // Prepare the Linked Data Object (LDO) with link data
    const linkLDOData: any = {
      url: "https://example.com/link123",
      id: "link123",
      linkType: "webpage", // Assuming LinkType is a string enum with values like "webpage", "image", etc.
    };

    // Create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = buildThing(createThing({ name: linkLDOData.id }))
      .addStringNoLocale(linkDefinition.properties.url, linkLDOData.url)
      .addStringNoLocale(linkDefinition.properties.id, linkLDOData.id)
      .addStringNoLocale(linkDefinition.properties.linkType, linkLDOData.linkType)
      .build();

    // Call the read method to convert the LDO to a Link object
    const link: Link = linkLDO.read(ldoThing);

    // Check if the Link object matches the input data
    expect(link).toEqual(linkLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Link object", () => {
    // Prepare the Link object
    const link: Link = {
      url: "https://example.com/link456",
      id: "link456",
      linkType: LinkType.CHAT_LINK, // Assuming LinkType is an enum with values like Image, Webpage, etc.
    };

    // Call the create method to create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = linkLDO.create(link);

    // Check if the created ThingLocal contains the correct values
    expect(ldoThing.url).toBe(`${rdfIdentity}link456`);
    expect(getStringNoLocale(ldoThing, linkDefinition.properties.url)).toBe(link.url);
    expect(getStringNoLocale(ldoThing, linkDefinition.properties.id)).toBe(link.id);
    expect(getStringNoLocale(ldoThing, linkDefinition.properties.linkType)).toBe(link.linkType.toString());
  });
});
