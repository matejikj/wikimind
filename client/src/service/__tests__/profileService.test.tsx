import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    saveSolidDatasetAt,
    setThing,
    createSolidDataset,
} from "@inrupt/solid-client";
import { getProfile, updateProfile } from "../profileService";

// Mock user session object
const userSession = {
    podUrl: "https://example.com/",
};

const myDataset = {
    "graphs": {
        "default": {
            "https://matejikj.datapod.igrant.io/WikiMind/profile/profile.ttl#Wikie": {
                "type": "Subject",
                "url": "https://matejikj.datapod.igrant.io/WikiMind/profile/profile.ttl#Wikie",
                "predicates": {
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
                        "namedNodes": [
                            "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Profile"
                        ]
                    },
                    "http://xmlns.com/foaf/0.1/#term_name": {
                        "literals": {
                            "http://www.w3.org/2001/XMLSchema#string": [
                                ""
                            ]
                        }
                    },
                    "http://xmlns.com/foaf/0.1/#term_surname": {
                        "literals": {
                            "http://www.w3.org/2001/XMLSchema#string": [
                                ""
                            ]
                        }
                    },
                    "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#profileImage": {
                        "literals": {
                            "http://www.w3.org/2001/XMLSchema#string": [
                                ""
                            ]
                        }
                    },
                    "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#webId": {
                        "literals": {
                            "http://www.w3.org/2001/XMLSchema#string": [
                                "https://matejikj.datapod.igrant.io/profile/card#me"
                            ]
                        }
                    }
                }
            },
            "https://matejikj.datapod.igrant.io/WikiMind/profile/profile.ttl#WikiMind": {
                "type": "Subject",
                "url": "https://matejikj.datapod.igrant.io/WikiMind/profile/profile.ttl#WikiMind",
                "predicates": {
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
                        "namedNodes": [
                            "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Profile"
                        ]
                    },
                    "http://xmlns.com/foaf/0.1/#term_name": {
                        "literals": {
                            "http://www.w3.org/2001/XMLSchema#string": [
                                "Jakub"
                            ]
                        }
                    },
                    "http://xmlns.com/foaf/0.1/#term_surname": {
                        "literals": {
                            "http://www.w3.org/2001/XMLSchema#string": [
                                "Matějík "
                            ]
                        }
                    },
                    "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#profileImage": {
                        "literals": {
                            "http://www.w3.org/2001/XMLSchema#string": [
                                ""
                            ]
                        }
                    },
                    "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#webId": {
                        "literals": {
                            "http://www.w3.org/2001/XMLSchema#string": [
                                "https://matejikj.datapod.igrant.io/profile/card#me"
                            ]
                        }
                    }
                }
            }
        }
    },
    "type": "Dataset",
    "internal_resourceInfo": {
        "sourceIri": "https://matejikj.datapod.igrant.io/WikiMind/profile/profile.ttl",
        "isRawData": false,
        "contentType": "text/turtle",
        "linkedResources": {
            "acl": [
                "https://matejikj.datapod.igrant.io/WikiMind/profile/profile.ttl.acl"
            ],
            "describedBy": [
                "https://matejikj.datapod.igrant.io/WikiMind/profile/profile.ttl.meta"
            ],
            "type": [
                "http://www.w3.org/ns/ldp#Resource"
            ]
        },
        "aclUrl": "https://matejikj.datapod.igrant.io/WikiMind/profile/profile.ttl.acl",
        "permissions": {
            "user": {
                "read": true,
                "append": true,
                "write": true,
                "control": false
            },
            "public": {
                "read": true,
                "append": true,
                "write": false,
                "control": false
            }
        }
    }
}

const mockUserSession = {
    "isLogged": true,
    "webId": "https://matejikj.datapod.igrant.io/profile/card#me",
    "podUrl": "https://matejikj.datapod.igrant.io/",
    "podAccessControlPolicy": 0
}

// Mock profile object
const mockProfile: any = {
    // ... Define your mock profile data here ...
};

// Mock profile dataset
const mockProfileDataset = createSolidDataset();

describe("getProfile", () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should return profile when it exists", async () => {
        // Mock profileThing
        const mockProfileThing = {
            // ... Define your mock profile thing data here ...
        };

        // Mock read function
        const mockRead = jest.fn().mockReturnValueOnce(mockProfile);

        jest.mock("../models/things/ProfileLDO", () => {
            return {
                ProfileLDO: jest.fn().mockImplementation(() => {
                    return {
                        read: mockRead,
                    };
                }),
            };
        });

        const result = await getProfile(mockUserSession);

        expect(result).toEqual(mockProfile);
        expect(mockRead).toHaveBeenCalledWith(mockProfileThing);
    });

    test("should return undefined when profile does not exist", async () => {
        jest.mock("../models/things/ProfileLDO", () => {
            return {
                ProfileLDO: jest.fn().mockImplementation(() => {
                    return {
                        read: jest.fn(),
                    };
                }),
            };
        });

        const result = await getProfile(mockUserSession);

        expect(result).toBeUndefined();
    });
});
