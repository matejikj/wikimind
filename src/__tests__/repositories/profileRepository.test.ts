import {
    buildThing,
    createSolidDataset,
    createThing,
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import profileDefinition from "../../definitions/profile.json";
import { ProfileLDO } from "../../models/things/ProfileLDO";
import { Profile } from "../../models/types/Profile";
import { ProfileRepository } from "../../repository/profileRepository";

jest.mock("@inrupt/solid-client-authn-browser", () => ({
    fetch: jest.fn(),
}));

jest.mock("@inrupt/solid-client", () => {
    const originalModule = jest.requireActual("@inrupt/solid-client");
    return {
        ...originalModule,
        getSolidDataset: jest.fn(),
        saveSolidDatasetAt: jest.fn(),
    };
});
let savedDataset = createSolidDataset();

describe("ProfileRepository", () => {
    const profileUrl = "https://inrupt.com/.well-known/sdk-local-node/WikiMind";
    beforeEach(async () => {
        (getSolidDataset as jest.Mock).mockImplementation(
            async (url, fetch) => {
                return savedDataset;
            }
        );
        (saveSolidDatasetAt as jest.Mock).mockImplementation(
            async (url, dataset, fetch) => {
                savedDataset = dataset;
            }
        );
        jest.clearAllMocks();
    });

    describe("getProfile", () => {
        it("should fetch profile and return parsed profile", async () => {
            const test: Profile = {
                webId: "https://matejikj.datapod.igrant.io/profile/card#me",
                name: "Jakub",
                surname: "Matejik",
                source: "",
            };

            const thing = buildThing(createThing({ name: "WikiMind#WikiMind" }))
                .addUrl("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", profileDefinition.identity)
                .addStringNoLocale(profileDefinition.properties.name, "Jakub")
                .addStringNoLocale(profileDefinition.properties.webId, "https://matejikj.datapod.igrant.io/profile/card#me")
                .addStringNoLocale(profileDefinition.properties.surname, "Matejik")
                .addStringNoLocale(profileDefinition.properties.source, "")
                .build();
            const myDataset = await getSolidDataset(profileUrl, { fetch });
            const savedProfileSolidDataset = setThing(myDataset, thing);
            await saveSolidDatasetAt(profileUrl, savedProfileSolidDataset, { fetch });
            const profileRepository = new ProfileRepository();
            const profile = await profileRepository.getProfile(profileUrl);
            expect(getSolidDataset).toHaveBeenCalledWith(profileUrl, { fetch });
            expect(profile).toEqual(test);
        });
    });

    describe("updateProfile", () => {
        it("should fetch profile and return parsed profile", async () => {
            const test: Profile = {
                webId: "https://matejikj.datapod.igrant.io/profile/card#me",
                name: "Jakub",
                surname: "Matejik",
                source: "",
            };
            const profileRepository = new ProfileRepository();
            await profileRepository.updateProfile(profileUrl, test);
            let myDataset = await getSolidDataset(profileUrl, { fetch });
            const profileThing = getThing(myDataset, profileUrl);
            const profileLDO = new ProfileLDO(profileDefinition);
            const datasetProfile = profileLDO.read(profileThing);
            expect(getSolidDataset).toHaveBeenCalledWith(profileUrl, { fetch });
            expect(datasetProfile).toEqual(test);
        });
    });
});
