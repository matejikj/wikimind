import {
    createSolidDataset,
    deleteSolidDataset,
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import classDefinition from "../../definitions/class.json";
import { ClassLDO } from "../../models/things/ClassLDO";
import { Class } from "../../models/types/Class";
import { generate_uuidv4 } from "../../service/utils";
import { ClassRepository } from "../../repository/classRepository";

jest.mock("@inrupt/solid-client-authn-browser", () => ({
    fetch: jest.fn(),
}));

jest.mock("@inrupt/solid-client", () => {
    const originalModule = jest.requireActual("@inrupt/solid-client");
    return {
        ...originalModule,
        getSolidDataset: jest.fn(),
        saveSolidDatasetAt: jest.fn(),
        deleteSolidDataset: jest.fn(),
    };
});

const classId = generate_uuidv4()
const classDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/classs/${classId}.ttl`

let classDataset = createSolidDataset();

describe("ClassRepository", () => {
    beforeEach(async () => {
        (getSolidDataset as jest.Mock).mockImplementation(
            async (url, fetch) => {
                if (url === classDatasetUrl) {
                    return classDataset
                }
            }
        );
        (saveSolidDatasetAt as jest.Mock).mockImplementation(
            async (url, dataset, fetch) => {
                if (url === classDatasetUrl) {
                    classDataset = dataset
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

    describe("getClass", () => {
        it("should fetch class and return parsed class", async () => {
            const classLDO = new ClassLDO(classDefinition)

            const testClass: Class = {
                id: `WikiMind/classs/${classId}.ttl#${classId}`,
                name: "Class",
                teacher: "John",
                storage: "https://inrupt.com/.well-known/sdk-local-node/",
                source: "class-pod-1",
            };

            
            const classthing = classLDO.create(testClass)
            const myDataset = await getSolidDataset(classDatasetUrl, { fetch });
            const savedClassSolidDataset = setThing(myDataset, classthing);
            await saveSolidDatasetAt(classDatasetUrl, savedClassSolidDataset, { fetch });


            const classRepository = new ClassRepository();
            const classResult = await classRepository.getClass(classDatasetUrl);

            expect(classResult).toEqual(testClass);
        });
    });

    describe("createClass", () => {
        it("should fetch class and return parsed class", async () => {
            const classLDO = new ClassLDO(classDefinition)

            const testClass: Class = {
                id: `WikiMind/classs/${classId}.ttl#${classId}`,
                name: "Class",
                teacher: "John",
                storage: "https://inrupt.com/.well-known/sdk-local-node/",
                source: "class-pod-1",
            };
            const myDataset = await getSolidDataset(classDatasetUrl, { fetch });
            const thing = getThing(myDataset, `https://inrupt.com/.well-known/sdk-local-node/WikiMind/classs/${classId}.ttl#${classId}`)
            const classthing = classLDO.read(thing)
            expect(classthing).toEqual(testClass);
        });
    });

    describe("removeClass", () => {
        it("should fetch class and return parsed class", async () => {
            const classRepository = new ClassRepository();
            const classResult = await classRepository.removeClass(classDatasetUrl);
            expect(classResult).toEqual(undefined);
        });
    });
});
