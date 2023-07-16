import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    createSolidDataset,
    ThingLocal, buildThing, createThing, getStringNoLocale,

} from "@inrupt/solid-client";
import { LinkLDO } from "../../models/things/LinkLDO";
import linkDefinition from "../../definitions/link.json";
import { AccessControlPolicy } from "../../models/types/AccessControlPolicy";
import { generate_uuidv4 } from "../../service/utils";
import { Link } from "../../models/types/Link";
import { LinkRepository } from "../linkRepository";
import { LinkType } from "../../models/types/LinkType";

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

        );        //   (getThing as jest.Mock).mockReturnValue(datasetMock.graphs.default[linkThingUrl]);
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

    // describe("createLink", () => {
    //     it("should fetch link and return parsed link", async () => {
    //         const linkLDO = new LinkLDO(linkDefinition)

    //         const testLink: Link = {
    //             id: linkId,
    //             url: linkDatasetUrl,
    //             linkType: LinkType.CHAT_LINK
    //         };

    //         const linkRepository = new LinkRepository();
    //         const linkResult = await linkRepository.createLink(linkDatasetUrl, testLink);

    //         const myDataset = await getSolidDataset(linkDatasetUrl, { fetch });
    //         const thing = getThing(myDataset, `https://inrupt.com/.well-known/sdk-local-node/WikiMind/links/${linkId}.ttl#${linkId}`)
    //         const linkthing = linkLDO.read(thing)

    //         expect(linkthing).toEqual(testLink);
    //     });
    // });
});
