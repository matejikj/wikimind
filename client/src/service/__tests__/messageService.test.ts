import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    createSolidDataset,
    ThingLocal, buildThing, createThing, getStringNoLocale,

} from "@inrupt/solid-client";
import { MessageService } from "../messageService";
import chatDefinition from "../../definitions/chat.json";
import linkDefinition from "../../definitions/link.json";
import { Profile } from "../../models/types/Profile";
import { ProfileLDO } from "../../models/things/ProfileLDO";
import { getStringNoLocale as originalGetStringNoLocale } from "@inrupt/solid-client";
import { WIKIMIND } from "../containerService";
import { Link } from "../../models/types/Link";
import { generate_uuidv4 } from "../utils";
import { LinkType } from "../../models/types/LinkType";
import { ClassLDO } from "../../models/things/ClassLDO";
import { LinkLDO } from "../../models/things/LinkLDO";
import { AccessControlPolicy } from "../../models/types/AccessControlPolicy";
import { Chat } from "../../models/types/Chat";
import { ChatLDO } from "../../models/things/ChatLDO";

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

let chatsDataset = createSolidDataset();
let chatDataset = createSolidDataset();
let storageDataset = createSolidDataset();
const chatsDatasetUrl = "https://inrupt.com/.well-known/sdk-local-node/WikiMind/chats/chats.ttl"
const chatId = generate_uuidv4()
const chatDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/chats/${chatId}.ttl`

describe("ProfileRepository", () => {
    const podUrl = "https://inrupt.com/.well-known/sdk-local-node/";
    const profileMock: Profile = {
        webId: "https://matejikj.datapod.igrant.io/profile/card#me",
        name: "",
        surname: "",
        source: "",
    };

    beforeEach(async () => {


        (getSolidDataset as jest.Mock).mockImplementation(
            async (url, fetch) => {
                if (url === chatsDatasetUrl) {
                    return chatsDataset
                }
                if (url === chatDatasetUrl) {
                    return chatDataset
                }
            }

        );        //   (getThing as jest.Mock).mockReturnValue(datasetMock.graphs.default[profileThingUrl]);
        (saveSolidDatasetAt as jest.Mock).mockImplementation(
            async (url, dataset, fetch) => {
                if (url === chatsDatasetUrl) {
                    chatsDataset = dataset
                }
                if (url === chatDatasetUrl) {
                    chatDataset = dataset
                }
            }
        );
        jest.clearAllMocks();
    });

    describe("getProfile", () => {
        it("should fetch profile and return parsed profile", async () => {
            const chatLDO = new ChatLDO(chatDefinition)

            const linkLDO = new LinkLDO(linkDefinition)

            const test: Link = {
                id: generate_uuidv4(),
                url: chatDatasetUrl,
                linkType: LinkType.CHAT_LINK
            };
            const testthing = linkLDO.create(test)

            const chat: Chat = {
                id: `WikiMind/chats/${chatId}.ttl#${chatId}`,
                host: "John",
                guest: "Jane",
                storage: "https://inrupt.com/.well-known/sdk-local-node/",
                source: "chat-pod-1",
                accessControlPolicy: AccessControlPolicy.ACP,
                lastMessage: "Hello!",
                modified: "2023-07-15T10:30:00Z",
            };
            const chatthing = chatLDO.create(chat)

            const linksDataset = await getSolidDataset(chatsDatasetUrl, { fetch });
            const savedLinkSolidDataset = setThing(linksDataset, testthing);
            await saveSolidDatasetAt(chatsDatasetUrl, savedLinkSolidDataset, { fetch });

            const chatsDataset = await getSolidDataset(chatDatasetUrl, { fetch });
            const savedChatsSolidDataset = setThing(chatsDataset, chatthing);
            await saveSolidDatasetAt(chatDatasetUrl, savedChatsSolidDataset, { fetch });


            const messageService = new MessageService();
            const chatList = await messageService.getChatList(podUrl);

            expect(chatList).toEqual([chat]);
        });
    });

    // describe("updateProfile", () => {
    //     it("should fetch profile and return parsed profile", async () => {
    //         const test: Profile = {
    //             webId: "https://matejikj.datapod.igrant.io/profile/card#me",
    //             name: "Jakub",
    //             surname: "Matejik",
    //             source: "",
    //         };

    //         const profileService = new ProfileService();

    //         await profileService.updateProfile(podUrl, test);

    //         let myDataset = await getSolidDataset(podUrl, { fetch });
    //         const profileThing = getThing(myDataset, podUrl + "WikiMind/profile/profile.ttl#WikiMind");
    //         const profileLDO = new ProfileLDO(profileDefinition);
    //         const datasetProfile = profileLDO.read(profileThing);

    //         expect(datasetProfile).toEqual(test);
    //     });
    // });
});
