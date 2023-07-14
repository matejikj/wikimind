import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    createSolidDataset,
    ThingLocal, buildThing, createThing, getStringNoLocale,

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
        // getThing: jest.fn(),
        saveSolidDatasetAt: jest.fn(),
        // setThing: jest.fn(),
    };
});
// const newThing: ThingLocal = 
// return newThing;

// jest.mock('../../service/containerService', () => ({
//     create: jest.fn(),
// }));

let savedDataset = createSolidDataset();


describe("ProfileRepository", () => {
    const profileUrl = "https://inrupt.com/.well-known/sdk-local-node/WikiMind";
    const profileMock: Profile = {
        webId: "https://matejikj.datapod.igrant.io/profile/card#me",
        name: "",
        surname: "",
        ownerPod: "",
    };

    beforeEach(async () => {


        (getSolidDataset as jest.Mock).mockImplementation(
            async (url, fetch) => {
                return savedDataset;
            }

        );        //   (getThing as jest.Mock).mockReturnValue(datasetMock.graphs.default[profileThingUrl]);
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
                ownerPod: "",
            };


            // 'https://inrupt.com/.well-known/sdk-local-node/WikiMind#WikiMind'


            const thing = buildThing(createThing({ name: "WikiMind#WikiMind" }))
                .addUrl("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", profileDefinition.identity)
                .addStringNoLocale(profileDefinition.properties.name, "Jakub")
                .addStringNoLocale(profileDefinition.properties.webId, "https://matejikj.datapod.igrant.io/profile/card#me")
                .addStringNoLocale(profileDefinition.properties.surname, "Matejik")
                .addStringNoLocale(profileDefinition.properties.ownerPod, "")
                .build();

            const myDataset = await getSolidDataset(profileUrl, { fetch });
            const savedProfileSolidDataset = setThing(myDataset, thing);
            await saveSolidDatasetAt(profileUrl, savedProfileSolidDataset, { fetch });


            const profileRepository = new ProfileRepository();
            const profile = await profileRepository.getProfile(profileUrl);

            expect(getSolidDataset).toHaveBeenCalledWith(profileUrl, { fetch });
            //   expect(getThing).toHaveBeenCalledWith(datasetMock, profileThingUrl);

            expect(profile).toEqual(test);
        });
    });

    describe("updateProfile", () => {
        it("should fetch profile and return parsed profile", async () => {
            const test: Profile = {
                webId: "https://matejikj.datapod.igrant.io/profile/card#me",
                name: "Jakub",
                surname: "Matejik",
                ownerPod: "",
            };

            const profileRepository = new ProfileRepository();

            await profileRepository.updateProfile(profileUrl, test);
            
            let myDataset = await getSolidDataset(profileUrl, { fetch });
            const profileThing = getThing(myDataset, profileUrl);
            const profileLDO = new ProfileLDO(profileDefinition);
            const datasetProfile = profileLDO.read(profileThing);
      
            expect(getSolidDataset).toHaveBeenCalledWith(profileUrl, { fetch });
            //   expect(getThing).toHaveBeenCalledWith(datasetMock, profileThingUrl);

            expect(datasetProfile).toEqual(test);
        });
    });
});
