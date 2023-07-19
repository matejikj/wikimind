import {
  ThingLocal,
  buildThing,
  createThing,
  setStringNoLocale,
  getStringNoLocale,
} from "@inrupt/solid-client";
import { ProfileLDO } from "../../models/things/ProfileLDO";
import { Profile } from "../../models/types/Profile";
import profileDefinition from "../../definitions/profile.json";
import { WIKIMIND } from "../../service/containerService";

jest.mock("@inrupt/solid-client-authn-browser", () => ({
  fetch: jest.fn(),
}));

describe("ProfileLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const profileLDO = new ProfileLDO(profileDefinition);

  test("should read a Profile object from a Linked Data Object", () => {
    // Prepare the Linked Data Object (LDO) with profile data
    const profileLDOData: any = {
      name: "John",
      surname: "Doe",
      webId: "https://example.com/johndoe",
      source: "https://example.com/profile123",
    };

    // Create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = buildThing(createThing({ name: rdfIdentity }))
      .addStringNoLocale(profileDefinition.properties.name, profileLDOData.name)
      .addStringNoLocale(profileDefinition.properties.surname, profileLDOData.surname)
      .addStringNoLocale(profileDefinition.properties.webId, profileLDOData.webId)
      .addStringNoLocale(profileDefinition.properties.source, profileLDOData.source)
      .build();

    // Call the read method to convert the LDO to a Profile object
    const profile: Profile = profileLDO.read(ldoThing);

    // Check if the Profile object matches the input data
    expect(profile).toEqual(profileLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Profile object", () => {
    // Prepare the Profile object
    const profile: Profile = {
      name: "Alice",
      surname: "Smith",
      webId: "https://example.com/alicesmith",
      source: "https://example.com/profile456",
    };

    // Call the create method to create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = profileLDO.create(profile);

    // Check if the created ThingLocal contains the correct values
    expect(ldoThing.url).toBe(`${rdfIdentity}${WIKIMIND}`);
    expect(getStringNoLocale(ldoThing, profileDefinition.properties.name)).toBe(profile.name);
    expect(getStringNoLocale(ldoThing, profileDefinition.properties.surname)).toBe(profile.surname);
    expect(getStringNoLocale(ldoThing, profileDefinition.properties.webId)).toBe(profile.webId);
    expect(getStringNoLocale(ldoThing, profileDefinition.properties.source)).toBe(profile.source);
  });
});
