import {
    createSolidDataset,
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import examDefinition from "../../definitions/exam.json";
import { ExamLDO } from "../../models/things/ExamLDO";
import { Exam } from "../../models/types/Exam";
import { generate_uuidv4 } from "../../service/utils";
import { ExamRepository } from "../../repository/examRepository";

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

const examId = generate_uuidv4()
const examDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/exams/${examId}.ttl`
let examDataset = createSolidDataset();

describe("ExamRepository", () => {
    beforeEach(async () => {
        (getSolidDataset as jest.Mock).mockImplementation(
            async (url, fetch) => {
                if (url === examDatasetUrl) {
                    return examDataset
                }
            }
        );
        (saveSolidDatasetAt as jest.Mock).mockImplementation(
            async (url, dataset, fetch) => {
                if (url === examDatasetUrl) {
                    examDataset = dataset
                }
            }
        );
        jest.clearAllMocks();
    });

    describe("getExam", () => {
        it("should fetch exam and return parsed exam", async () => {
            const examLDO = new ExamLDO(examDefinition)
            const exam: Exam = {
                id: `WikiMind/exams/${examId}.ttl#${examId}`,
                profile: "John",
                mindMap: "https://inrupt.com/.well-known/sdk-local-node/",
                max: 5,
                result: 4
            };
            const examthing = examLDO.create(exam)
            const myDataset = await getSolidDataset(examDatasetUrl, { fetch });
            const savedExamSolidDataset = setThing(myDataset, examthing);
            await saveSolidDatasetAt(examDatasetUrl, savedExamSolidDataset, { fetch });

            const examRepository = new ExamRepository();
            const examResult = await examRepository.getExams(examDatasetUrl);

            expect(examResult).toEqual([exam]);
        });
    });

    describe("createExam", () => {
        it("should fetch exam and return parsed exam", async () => {
            const examLDO = new ExamLDO(examDefinition)

            const testExam: Exam = {
                id: `WikiMind/exams/${examId}.ttl#${examId}`,
                profile: "John",
                mindMap: "https://inrupt.com/.well-known/sdk-local-node/",
                max: 5,
                result: 4
            };
            const myDataset = await getSolidDataset(examDatasetUrl, { fetch });
            const thing = getThing(myDataset, `https://inrupt.com/.well-known/sdk-local-node/WikiMind/exams/${examId}.ttl#${examId}`)
            const examthing = examLDO.read(thing)

            expect(examthing).toEqual(testExam);
        });
    });
});
