import { fetch } from "@inrupt/solid-client-authn-browser";
import {
  getSolidDataset,
  getThing,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import { ProfileRepository } from "../profileRepository";
import profileDefinition from "../../definitions/profile.json";
import { Profile } from "../../models/types/Profile";
import { ProfileLDO } from "../../models/things/ProfileLDO";
import { getStringNoLocale as originalGetStringNoLocale } from "@inrupt/solid-client";
import { WIKIMIND } from "../../service/containerService";

jest.mock("@inrupt/solid-client-authn-browser", () => ({
  fetch: jest.fn(),
}));

jest.mock("@inrupt/solid-client", () => {
  const originalModule = jest.requireActual("@inrupt/solid-client");
  return {
    ...originalModule,
    getSolidDataset: jest.fn(),
    getThing: jest.fn(),
    saveSolidDatasetAt: jest.fn(),
    setThing: jest.fn(),
  };
});

describe("ProfileRepository", () => {
  const profileUrl = "https://example.com/profile";
  const profileThingUrl = `${profileUrl}#${WIKIMIND}`;
  const profileMock: Profile = {
    webId: "https://matejikj.datapod.igrant.io/profile/card#me",
    name: "",
    surname: "",
    profileImage: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should fetch profile and return parsed profile", async () => {
      const datasetMock = {
        graphs: {
          default: {
            [profileThingUrl]: {
              type: "Subject",
              url: profileThingUrl,
              predicates: {
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
                  namedNodes: [
                    "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Profile",
                  ],
                },
                "http://xmlns.com/foaf/0.1/#term_name": {
                  literals: {
                    "http://www.w3.org/2001/XMLSchema#string": [""],
                  },
                },
                "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#webId": {
                  literals: {
                    "http://www.w3.org/2001/XMLSchema#string": [
                      "https://matejikj.datapod.igrant.io/profile/card#me",
                    ],
                  },
                },
                "http://xmlns.com/foaf/0.1/#term_surname": {
                  literals: {
                    "http://www.w3.org/2001/XMLSchema#string": [""],
                  },
                },
                "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#profileImage": {
                  literals: {
                    "http://www.w3.org/2001/XMLSchema#string": [""],
                  },
                },
              },
            },
          },
        },
        type: "Dataset",
        internal_resourceInfo: {
          sourceIri: profileUrl,
          isRawData: false,
          contentType: "text/turtle",
          linkedResources: {
            acl: [`${profileUrl}.acl`],
            describedBy: [`${profileUrl}.meta`],
            type: ["http://www.w3.org/ns/ldp#Resource"],
          },
          aclUrl: `${profileUrl}.acl`,
          permissions: {
            user: {
              read: true,
              append: true,
              write: true,
              control: false,
            },
            public: {
              read: true,
              append: false,
              write: false,
              control: false,
            },
          },
        },
      };

      (getSolidDataset as jest.Mock).mockResolvedValue(datasetMock);
      (getThing as jest.Mock).mockReturnValue(datasetMock.graphs.default[profileThingUrl]);

      const profileRepository = new ProfileRepository();
      const profile = await profileRepository.getProfile(profileUrl);

      expect(getSolidDataset).toHaveBeenCalledWith(profileUrl, { fetch });
      expect(getThing).toHaveBeenCalledWith(datasetMock, profileThingUrl);
      expect(profile).toEqual(profileMock);
    });
  });
});
