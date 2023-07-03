import { WIKIMIND } from "../../../service/containerService";
import { rdf_type } from "../../LDO";
import { Profile } from "../../types/Profile";
import { ProfileLDO } from "../ProfileLDO";
import { createThing, getStringNoLocale, buildThing, addStringNoLocale, addUrl } from "@inrupt/solid-client";

describe("ProfileLDO", () => {
  let profileLDO: ProfileLDO;

  beforeEach(() => {
    profileLDO = new ProfileLDO({});
  });

  test("read should return Profile object", () => {
    const mockThing = createThing({ name: WIKIMIND });
    addStringNoLocale(mockThing, "name", "John");
    addStringNoLocale(mockThing, "surname", "Doe");
    addStringNoLocale(mockThing, "webId", "https://example.com/johndoe");
    addStringNoLocale(mockThing, "profileImage", "https://example.com/profile.jpg");

    const result = profileLDO.read(mockThing);

    expect(result).toEqual({
      name: "John",
      surname: "Doe",
      webId: "https://example.com/johndoe",
      profileImage: "https://example.com/profile.jpg",
    });
  });

  test("create should return ThingLocal representing Profile object", () => {
    const mockProfile: Profile = {
      name: "John",
      surname: "Doe",
      webId: "https://example.com/johndoe",
      profileImage: "https://example.com/profile.jpg",
    };

    const result = profileLDO.create(mockProfile);

    expect(getStringNoLocale(result, "name")).toBe("John");
    expect(getStringNoLocale(result, "surname")).toBe("Doe");
    expect(getStringNoLocale(result, "webId")).toBe("https://example.com/johndoe");
    expect(getStringNoLocale(result, "profileImage")).toBe("https://example.com/profile.jpg");
  });
});
