import {
    createSolidDataset,
    deleteSolidDataset,
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import mindMapDefinition from "../../definitions/mindMap.json";
import { MindMapLDO } from "../../models/things/MindMapLDO";
import { MindMap } from "../../models/types/MindMap";
import { generate_uuidv4 } from "../../service/utils";
import { MindMapRepository } from "../mindMapRepository";

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
        deleteSolidDataset: jest.fn(),
    };
});


const mindMapId = generate_uuidv4()
const mindMapDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/mindMaps/${mindMapId}.ttl`

let mindMapDataset = createSolidDataset();


describe("MindMapRepository", () => {



    beforeEach(async () => {


        (getSolidDataset as jest.Mock).mockImplementation(
            async (url, fetch) => {
                if (url === mindMapDatasetUrl) {
                    return mindMapDataset
                }
            }

        );        //   (getThing as jest.Mock).mockReturnValue(datasetMock.graphs.default[mindMapThingUrl]);
        (saveSolidDatasetAt as jest.Mock).mockImplementation(
            async (url, dataset, fetch) => {
                if (url === mindMapDatasetUrl) {
                    mindMapDataset = dataset
                }
            }
        );

        (deleteSolidDataset as jest.Mock).mockImplementation(
            async (url, fetch) => {
                return undefined;
            }
        );




        jest.clearAllMocks();
    });

    describe("getMindMap", () => {
        it("should fetch mindMap and return parsed mindMap", async () => {
            const mindMapLDO = new MindMapLDO(mindMapDefinition)

            const testMindMap: MindMap = {
                id: `WikiMind/mindMaps/${mindMapId}.ttl#${mindMapId}`,
                name: "MindMap",
                teacher: "John",
                storage: "https://inrupt.com/.well-known/sdk-local-node/",
                source: "mindMap-pod-1",
            };
            
            const mindMapthing = mindMapLDO.create(testMindMap)
            const myDataset = await getSolidDataset(mindMapDatasetUrl, { fetch });
            const savedMindMapSolidDataset = setThing(myDataset, mindMapthing);
            await saveSolidDatasetAt(mindMapDatasetUrl, savedMindMapSolidDataset, { fetch });


            const mindMapRepository = new MindMapRepository();
            const mindMapResult = await mindMapRepository.getMindMap(mindMapDatasetUrl);

            expect(mindMapResult).toEqual(testMindMap);
        });
    });

    describe("createMindMap", () => {
        it("should fetch mindMap and return parsed mindMap", async () => {
            const mindMapLDO = new MindMapLDO(mindMapDefinition)

            const testMindMap: MindMap = {
                id: `WikiMind/mindMaps/${mindMapId}.ttl#${mindMapId}`,
                name: "MindMap",
                teacher: "John",
                storage: "https://inrupt.com/.well-known/sdk-local-node/",
                source: "mindMap-pod-1",
            };

            


            const mindMapRepository = new MindMapRepository();
            const mindMapResult = await mindMapRepository.createMindMap(mindMapDatasetUrl, testMindMap);

            const myDataset = await getSolidDataset(mindMapDatasetUrl, { fetch });
            const thing = getThing(myDataset, `https://inrupt.com/.well-known/sdk-local-node/WikiMind/mindMaps/${mindMapId}.ttl#${mindMapId}`)
            const mindMapthing = mindMapLDO.read(thing)

            expect(mindMapthing).toEqual(testMindMap);
        });
    });

    describe("updateMindMap", () => {
        it("should fetch mindMap and return parsed mindMap", async () => {
            const mindMapLDO = new MindMapLDO(mindMapDefinition)

            const testMindMap: MindMap = {
                id: `WikiMind/mindMaps/${mindMapId}.ttl#${mindMapId}`,
                name: "MindMap",
                teacher: "John",
                storage: "https://inrupt.com/.well-known/sdk-local-node/",
                source: "mindMap-pod-1",
            };

            const mindMapRepository = new MindMapRepository();
            const mindMapResult = await mindMapRepository.removeMindMap(mindMapDatasetUrl);

            expect(mindMapResult).toEqual(undefined);
        });
    });
});
