import { WIKIMIND } from "../../../service/containerService";
import { rdf_type } from "../../LDO";
import { Profile } from "../../types/Profile";
import { ProfileLDO } from "../ProfileLDO";
import { createThing, getStringNoLocale, buildThing, addStringNoLocale, addUrl } from "@inrupt/solid-client";

/**
 * Mocks the container service by returning a fixed value for the WIKIMIND constant.
 */
jest.mock("../../../service/containerService", () => {
  return {
    WIKIMIND: 'WikiMind',
  };
});

/**
 * Tests for the ProfileLDO class.
 */
describe("ProfileLDO", () => {
  let profileLDO: ProfileLDO;

  beforeEach(() => {
    // Create a new instance of ProfileLDO with specified identity and properties.
    profileLDO = new ProfileLDO({
      "identity": "https://inrupt.com/.well-known/sdk-local-node/WikiMind",
      "properties": {
        "surname": "http://xmlns.com/foaf/0.1/#term_surname",
        "name": "http://xmlns.com/foaf/0.1/#term_name",
        "webId": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#webId",
        "source": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#source"
      }
    });
  });


  test("read should return Profile object", () => {
    // Create a mock Thing with relevant properties.
    const mockThing = buildThing(createThing({ name: WIKIMIND }))
      .addUrl(rdf_type, "https://inrupt.com/.well-known/sdk-local-node/WikiMind")
      .addStringNoLocale("http://xmlns.com/foaf/0.1/#term_name", "John")
      .addStringNoLocale("http://xmlns.com/foaf/0.1/#term_surname", "Doe")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#webId", "https://example.com/johndoe")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#source", "https://example.com/profile.jpg")
      .build();

    const result = profileLDO.read(mockThing);

    // Assert the returned Profile object has expected values.
    expect(result).toEqual({
      name: "John",
      surname: "Doe",
      webId: "https://example.com/johndoe",
      source: "https://example.com/profile.jpg",
    });
  });

  test("create should return ThingLocal representing Profile object", () => {
    const mockProfile: Profile = {
      name: "John",
      surname: "Doe",
      webId: "https://example.com/johndoe",
      source: "https://example.com/profile.jpg",
    };

    const result = profileLDO.create(mockProfile);

    // Assert the returned ThingLocal has expected property values.
    expect(getStringNoLocale(result, "http://xmlns.com/foaf/0.1/#term_name")).toBe("John");
    expect(getStringNoLocale(result, "http://xmlns.com/foaf/0.1/#term_surname")).toBe("Doe");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#webId")).toBe("https://example.com/johndoe");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#source")).toBe("https://example.com/profile.jpg");
  });
});
