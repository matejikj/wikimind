import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    createSolidDataset,
    ThingLocal, buildThing, createThing, getStringNoLocale,

} from "@inrupt/solid-client";
import { ProfileService } from "../profileService";
import profileDefinition from "../../definitions/profile.json";
import { Profile } from "../../models/types/Profile";
import { ProfileLDO } from "../../models/things/ProfileLDO";
import { getStringNoLocale as originalGetStringNoLocale } from "@inrupt/solid-client";
import { WIKIMIND } from "../../service/containerService";
import { Chat } from "../../models/types/Chat";
import { AccessControlPolicy } from "../../models/types/AccessControlPolicy";
import { generate_uuidv4 } from "../utils";

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
    const podUrl = "https://inrupt.com/.well-known/sdk-local-node/";
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


            const thing = buildThing(createThing({ name: "WikiMind/profile/profile.ttl#WikiMind" }))
                .addUrl("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", profileDefinition.identity)
                .addStringNoLocale(profileDefinition.properties.name, "Jakub")
                .addStringNoLocale(profileDefinition.properties.webId, "https://matejikj.datapod.igrant.io/profile/card#me")
                .addStringNoLocale(profileDefinition.properties.surname, "Matejik")
                .addStringNoLocale(profileDefinition.properties.ownerPod, "")
                .build();

            const myDataset = await getSolidDataset(podUrl, { fetch });
            const savedProfileSolidDataset = setThing(myDataset, thing);
            await saveSolidDatasetAt(podUrl, savedProfileSolidDataset, { fetch });


            const profileService = new ProfileService();
            const profile = await profileService.getProfile(podUrl);


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


            
            const profileService = new ProfileService();

            await profileService.updateProfile(podUrl, test);

            let myDataset = await getSolidDataset(podUrl, { fetch });
            const profileThing = getThing(myDataset, podUrl + "WikiMind/profile/profile.ttl#WikiMind");
            const profileLDO = new ProfileLDO(profileDefinition);
            const datasetProfile = profileLDO.read(profileThing);

            expect(datasetProfile).toEqual(test);
        });
    });
});
