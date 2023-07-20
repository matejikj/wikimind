import {
  AclDataset,
  SolidDataset,
  createAclFromFallbackAcl,
  createSolidDataset
} from "@inrupt/solid-client";
import { initializeAcl, isWacOrAcp } from "../../service/accessService";

jest.mock("../../service/accessService", () => {
  return {
    isWacOrAcp: jest.fn(),
    initializeAcl: jest.fn(),
  };
});
jest.mock("@inrupt/solid-client", () => {
  return {
    ...jest.requireActual("@inrupt/solid-client"),
    hasAccessibleAcl: () => true,
    hasFallbackAcl: () => true,
    createAclFromFallbackAcl: jest.fn(),
  };
});


beforeEach(() => {
  jest.clearAllMocks();
});

async function RunTest(testFunction: () => void): Promise<SolidDataset> {
  const aclDataset: AclDataset = {
    ...createSolidDataset(),
    internal_accessTo: "https://testpodurl.com/container/",
    internal_resourceInfo: {
      sourceIri: "https://testpodurl.com/container/.acl",
      isRawData: false,
    },
  };
  (createAclFromFallbackAcl as jest.Mock).mockReturnValue(aclDataset);
  const dataset = {
    ...createSolidDataset(),
    internal_resourceInfo: {
      sourceIri: "https://testpodurl.com/container/.acl",
      isRawData: false,
      contentType: "text/turtle",
      linkedResources: {},
    },
    internal_acl: {
      resourceAcl: null,
      fallbackAcl: aclDataset,
    },
  };

  let updatedAcl = createSolidDataset();
  (isWacOrAcp as jest.Mock).mockImplementation(async (d, uA) => {
    updatedAcl = uA;
  });
  
  (initializeAcl as jest.Mock).mockReturnValue(
    Promise.resolve(dataset)
  );

  await testFunction();
  return updatedAcl;
}

describe("solidAccess", () => {
  test("SetReadAccessToEveryone creates correct ACL definition", async () => {
    const updatedAcl = await RunTest(
      async () => {}
    );
  })})
