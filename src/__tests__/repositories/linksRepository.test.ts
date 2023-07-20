import {
    createSolidDataset,
    getSolidDataset,
    saveSolidDatasetAt,
    setThing
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import linkDefinition from "../../definitions/link.json";
import { LinkLDO } from "../../models/things/LinkLDO";
import { Link } from "../../models/types/Link";
import { LinkType } from "../../models/enums/LinkType";
import { generate_uuidv4 } from "../../service/utils";
import { LinkRepository } from "../../repository/linkRepository";

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

const linkId = generate_uuidv4()
const linkDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/links/${linkId}.ttl`
let linkDataset = createSolidDataset();

describe("LinkRepository", () => {
    beforeEach(async () => {
        (getSolidDataset as jest.Mock).mockImplementation(
            async (url, fetch) => {
                if (url === linkDatasetUrl) {
                    return linkDataset
                }
            }
        );
        (saveSolidDatasetAt as jest.Mock).mockImplementation(
            async (url, dataset, fetch) => {
                if (url === linkDatasetUrl) {
                    linkDataset = dataset
                }
            }
        );
        jest.clearAllMocks();
    });

    describe("getLinks", () => {
        it("should fetch link and return parsed link", async () => {
            const linkLDO = new LinkLDO(linkDefinition)

            const testLink: Link = {
                id: generate_uuidv4(),
                url: linkDatasetUrl,
                linkType: LinkType.CHAT_LINK
            };
            const linkthing = linkLDO.create(testLink)
            const myDataset = await getSolidDataset(linkDatasetUrl, { fetch });
            const savedLinkSolidDataset = setThing(myDataset, linkthing);
            await saveSolidDatasetAt(linkDatasetUrl, savedLinkSolidDataset, { fetch });
            const linkRepository = new LinkRepository();
            const linkResult = await linkRepository.getLinksList(linkDatasetUrl);
            expect(linkResult).toEqual([testLink]);
        });
    });
});
