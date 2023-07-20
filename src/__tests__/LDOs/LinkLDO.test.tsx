import {
  ThingLocal,
  buildThing,
  createThing,
  getStringNoLocale
} from "@inrupt/solid-client";
import linkDefinition from "../../definitions/link.json";
import { LinkType } from "../../models/enums/LinkType";
import { LinkLDO } from "../../models/things/LinkLDO";
import { Link } from "../../models/types/Link";

describe("LinkLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const linkLDO = new LinkLDO(linkDefinition);

  test("should read a Link object from a Linked Data Object", () => {
    const linkLDOData: any = {
      url: "https://example.com/link123",
      id: "link123",
      linkType: "webpage",
    };
    const ldoThing: ThingLocal = buildThing(createThing({ name: linkLDOData.id }))
      .addStringNoLocale(linkDefinition.properties.url, linkLDOData.url)
      .addStringNoLocale(linkDefinition.properties.id, linkLDOData.id)
      .addStringNoLocale(linkDefinition.properties.linkType, linkLDOData.linkType)
      .build();
    const link: Link = linkLDO.read(ldoThing);
    expect(link).toEqual(linkLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Link object", () => {
    const link: Link = {
      url: "https://example.com/link456",
      id: "link456",
      linkType: LinkType.CHAT_LINK,
    };
    const ldoThing: ThingLocal = linkLDO.create(link);
    expect(ldoThing.url).toBe(`${rdfIdentity}link456`);
    expect(getStringNoLocale(ldoThing, linkDefinition.properties.url)).toBe(link.url);
    expect(getStringNoLocale(ldoThing, linkDefinition.properties.id)).toBe(link.id);
    expect(getStringNoLocale(ldoThing, linkDefinition.properties.linkType)).toBe(link.linkType.toString());
  });
});
