import {
  ThingLocal,
  buildThing,
  createThing,
  getStringNoLocale
} from "@inrupt/solid-client";
import profileDefinition from "../../definitions/profile.json";
import { ProfileLDO } from "../../models/things/ProfileLDO";
import { Profile } from "../../models/types/Profile";
import { WIKIMIND } from "../../service/containerService";

jest.mock("@inrupt/solid-client-authn-browser", () => ({
  fetch: jest.fn(),
}));

describe("ProfileLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const profileLDO = new ProfileLDO(profileDefinition);

  test("should read a Profile object from a Linked Data Object", () => {
    const profileLDOData: any = {
      name: "Jan",
      surname: "Novak",
      webId: "https://example.com/jannovak",
      source: "https://example.com/profile123",
    };

    const ldoThing: ThingLocal = buildThing(createThing({ name: rdfIdentity }))
      .addStringNoLocale(profileDefinition.properties.name, profileLDOData.name)
      .addStringNoLocale(profileDefinition.properties.surname, profileLDOData.surname)
      .addStringNoLocale(profileDefinition.properties.webId, profileLDOData.webId)
      .addStringNoLocale(profileDefinition.properties.source, profileLDOData.source)
      .build();

    const profile: Profile = profileLDO.read(ldoThing);

    expect(profile).toEqual(profileLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Profile object", () => {
    const profile: Profile = {
      name: "Jan",
      surname: "Novak",
      webId: "https://example.com/jannovak",
      source: "https://example.com/profile456",
    };
    const ldoThing: ThingLocal = profileLDO.create(profile);
    expect(ldoThing.url).toBe(`${rdfIdentity}${WIKIMIND}`);
    expect(getStringNoLocale(ldoThing, profileDefinition.properties.name)).toBe(profile.name);
    expect(getStringNoLocale(ldoThing, profileDefinition.properties.surname)).toBe(profile.surname);
    expect(getStringNoLocale(ldoThing, profileDefinition.properties.webId)).toBe(profile.webId);
    expect(getStringNoLocale(ldoThing, profileDefinition.properties.source)).toBe(profile.source);
  });
});
