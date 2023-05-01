import { login, handleIncomingRedirect, getDefaultSession, fetch } from "@inrupt/solid-client-authn-browser";

import {
  addUrl,
  getThing,
  getSolidDataset,
  addStringNoLocale,
  buildThing,
  createSolidDataset,
  createThing,
  setThing,
  setUrl,
  getThingAll,
  createContainerAt,
  getStringNoLocale,
  getUrlAll,
  getUrl,
  Thing,
  getLinkedResourceUrlAll,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { MindMapLDO } from "../models/things/MindMapLDO";
import nodeDefinition from "../definitions/node.json"
import linkDefinition from "../definitions/link.json"
import mindMapDefinition from "../definitions/mindMapMetaData.json"
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { NodeLDO } from "../models/things/NodeLDO";
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";

export async function getMindMapList() {
  if (!getDefaultSession().info.isLoggedIn) {
    await login({
      oidcIssuer: "https://inrupt.net",
      redirectUrl: window.location.href,
      clientName: "My application"
    });
  } else {
    console.log('PRIHLASENO')
  }
  const readingListUrl: string = 'https://matejikj.inrupt.net/Wikie/mindMaps/'
  const myDataset = await getSolidDataset(
    readingListUrl,
    { fetch: fetch }          // fetch from authenticated session
  );
  const thing = getThing(myDataset, 'https://matejikj.inrupt.net/Wikie/mindMaps/');
  if (thing !== null) {
    return getUrlAll(thing, 'http://www.w3.org/ns/ldp#contains');
  }
  return []
}

export async function addNode(node: Node) {
  console.log("fdas")
  let fdas: MindMapDataset = {
    title: "mindMap_1",
    id: "fdas",
    url: "fdsa",
    acccessType: "fdas",
    created: "fdsa",
    nodes: [
      {
        "title": "Karel IV",
        "description": "kral ceskych zemi",
        "cx": 100,
        "cy": 50,
        "id": "id32",
      },
      {
        "title": "fdsa",
        "description": "kral ceskych zemi",
        "cx": 423,
        "cy": 87,
        "id": "id43",
      },
      {
        "title": "dsa",
        "description": "dsa dsa bcv",
        "cx": 200,
        "cy": 100,
        "id": "id432",
      },
      {
        "title": "nvbcnbcvnx",
        "description": "nbv aaaaa lkkl",
        "cx": 10,
        "cy": 100,
        "id": "id3543",
      }
    ],
    "links": [
      {
        "from": "id32",
        "to": "id432",
        "title": "mama",
        "id": "id3543"
      },
      {
        "from": "id32",
        "to": "id43",
        "title": "fds",
        "id": "id498443"
      }
    ]
  }

  createNode(fdas)

}
export async function getMindMap(url: string) {
  if (!getDefaultSession().info.isLoggedIn) {
    await login({
      oidcIssuer: "https://inrupt.net",
      redirectUrl: window.location.href,
      clientName: "My application"
    });
  } else {
    console.log('PRIHLASENO')
  }

  const readingListUrl: string = url
  const myDataset = await getSolidDataset(
    readingListUrl,
    { fetch: fetch }          // fetch from authenticated session
  );
  console.log(myDataset)
  // const things = await getThing(myDataset, 'http://www.w3.org/ns/ldp#contains');
  const things = await getThingAll(myDataset);
  console.log(things)

  // const fdsa = getUrl(things[0], 'http://www.w3.org/ns/ldp#contains')
  // console.log(fdsa)

  let nodes: Node[] = []
  let linkBuilder = new LinkLDO((linkDefinition as LDO<Link>))
  const filteredThings = things.filter(thing => {
    const types = getUrlAll(thing, RDF.type);
    // const types = getUrlAll(thing, 'http://www.w3.org/ns/ldp#contains');
    console.log(types)
    if (types.some(type => type === 'https://matejikj.inrupt.net/Wikie/vocabulary.ttl#Node')) {
      nodes.push(linkBuilder.read(thing))
    }
  });
}

export async function createNode(mindMap: MindMapDataset) {

  await handleIncomingRedirect();

  // 2. Start the Login Process if not already logged in.
  if (!getDefaultSession().info.isLoggedIn) {
    await login({
      oidcIssuer: "https://inrupt.net",
      redirectUrl: window.location.href,
      clientName: "My application"
    });
  } else {
    console.log('PRIHLASENO')
  }

  const cont = createContainerAt('https://matejikj.inrupt.net/' + 'Wikie', { fetch: fetch });
  console.log("FASDFASDFASD")
  console.log("FASDFASDFASD")
  console.log("FASDFASDFASD")
  console.log(RDF.type)

  let courseSolidDataset = createSolidDataset();

  // const bb: LDO<MindMap> = mindMapDefinition
  const mapBuilder = new MindMapLDO(mindMapDefinition)
  let cc = mapBuilder.create(mindMap)

  if (mindMap.nodes !== undefined) {
    let nodeBuilder = new NodeLDO((nodeDefinition as LDO<Node>))

    mindMap.nodes.forEach(node => {
      courseSolidDataset = setThing(courseSolidDataset, nodeBuilder.create(node));
      const propertyName = 'https://www.w3.org/ns/ldp#contains';
      const propertyValue = 'http://schema.org/alternateName';
      cc = setUrl(cc, propertyName, propertyValue);
    })
  }

  if (mindMap.links !== undefined) {
    let linkBuilder = new LinkLDO((linkDefinition as LDO<Link>))

    mindMap.links.forEach(link => {
      courseSolidDataset = setThing(courseSolidDataset, linkBuilder.create(link));
      const propertyName = 'https://www.w3.org/ns/ldp#contains';
      const propertyValue = RDF.Bag;
      cc = setUrl(cc, propertyName, propertyValue);

    })
  }
  courseSolidDataset = setThing(courseSolidDataset, cc);

  console.log(cc)

  const savedSolidDataset = await saveSolidDatasetAt(
    "https://matejikj.inrupt.net/Wikie/mindMaps/mindMap3.ttl",
    courseSolidDataset,
    { fetch: fetch }
  );
}

