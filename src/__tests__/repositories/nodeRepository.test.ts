import {
    createSolidDataset,
    getSolidDataset,
    saveSolidDatasetAt,
    setThing
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import nodeDefinition from "../../definitions/node.json";
import { NodeLDO } from "../../models/things/NodeLDO";
import { Node } from "../../models/types/Node";
import { generate_uuidv4 } from "../../service/utils";
import { NodeRepository } from "../../repository/nodeRepository";

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


const nodeId = generate_uuidv4()
const nodeDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/nodes/${nodeId}.ttl`

let nodeDataset = createSolidDataset();


describe("NodeRepository", () => {



    beforeEach(async () => {


        (getSolidDataset as jest.Mock).mockImplementation(
            async (url, fetch) => {
                if (url === nodeDatasetUrl) {
                    return nodeDataset
                }
            }

        );        //   (getThing as jest.Mock).mockReturnValue(datasetMock.graphs.default[nodeThingUrl]);
        (saveSolidDatasetAt as jest.Mock).mockImplementation(
            async (url, dataset, fetch) => {
                if (url === nodeDatasetUrl) {
                    nodeDataset = dataset
                }
            }
        );
        jest.clearAllMocks();
    });

    describe("getNodes", () => {
        it("should fetch node and return parsed node", async () => {
            const nodeLDO = new NodeLDO(nodeDefinition)

            const testNode: Node = {
                id: generate_uuidv4(),
                cx: 100,
                cy: 200,
                title: "My Node",
                uri: "https://example.com/node123",
                description: "This is a test node.",
                textColor: "black",
                color: "white",
                isInTest: true,
            };

            const nodething = nodeLDO.create(testNode)
            const myDataset = await getSolidDataset(nodeDatasetUrl, { fetch });
            const savedNodeSolidDataset = setThing(myDataset, nodething);
            await saveSolidDatasetAt(nodeDatasetUrl, savedNodeSolidDataset, { fetch });

            const nodeRepository = new NodeRepository();
            const nodeResult = await nodeRepository.getNodes(nodeDatasetUrl);

            expect(nodeResult).toEqual([testNode]);
        });
    });
});
