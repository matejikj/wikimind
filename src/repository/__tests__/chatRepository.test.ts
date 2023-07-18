import {
    createSolidDataset,
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import chatDefinition from "../../definitions/chat.json";
import { ChatLDO } from "../../models/things/ChatLDO";
import { AccessControlPolicy } from "../../models/enums/AccessControlPolicy";
import { Chat } from "../../models/types/Chat";
import { generate_uuidv4 } from "../../service/utils";
import { ChatRepository } from "../chatRepository";

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


const chatId = generate_uuidv4()
const chatDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/chats/${chatId}.ttl`

let chatDataset = createSolidDataset();


describe("ChatRepository", () => {



    beforeEach(async () => {


        (getSolidDataset as jest.Mock).mockImplementation(
            async (url, fetch) => {
                if (url === chatDatasetUrl) {
                    return chatDataset
                }
            }

        );        //   (getThing as jest.Mock).mockReturnValue(datasetMock.graphs.default[chatThingUrl]);
        (saveSolidDatasetAt as jest.Mock).mockImplementation(
            async (url, dataset, fetch) => {
                if (url === chatDatasetUrl) {
                    chatDataset = dataset
                }
            }
        );



        jest.clearAllMocks();
    });

    describe("getChat", () => {
        it("should fetch chat and return parsed chat", async () => {
            const chatLDO = new ChatLDO(chatDefinition)

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
            const myDataset = await getSolidDataset(chatDatasetUrl, { fetch });
            const savedChatSolidDataset = setThing(myDataset, chatthing);
            await saveSolidDatasetAt(chatDatasetUrl, savedChatSolidDataset, { fetch });


            const chatRepository = new ChatRepository();
            const chatResult = await chatRepository.getChat(chatDatasetUrl);

            expect(chatResult).toEqual(chat);
        });
    });
    

    describe("updateChat", () => {
        it("should fetch chat and return parsed chat", async () => {
            const chatLDO = new ChatLDO(chatDefinition)

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

            const chatRepository = new ChatRepository();
            const chatResult = await chatRepository.createChat(chatDatasetUrl, chat);

            const myDataset = await getSolidDataset(chatDatasetUrl, { fetch });
            const thing = getThing(myDataset, `https://inrupt.com/.well-known/sdk-local-node/WikiMind/chats/${chatId}.ttl#${chatId}`)
            const chatthing = chatLDO.read(thing)

            expect(chatthing).toEqual(chat);
        });
    });
});
