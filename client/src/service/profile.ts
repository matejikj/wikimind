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
  createContainerAt,
  getStringNoLocale,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";

export async function loginAndFetch() {

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

  const myDataset = await getSolidDataset(
    'https://matejikj.inrupt.net/test/set2/dataset.ttl', 
    { fetch: fetch }  // fetch function from authenticated session
  );

  const cont = createContainerAt('https://matejikj.inrupt.net/' + 'testt', {fetch: fetch});
  console.log(cont)

  const aa = getThing(
    myDataset,
    'https://matejikj.inrupt.net/test/set2/dataset.ttl#book1'
  );

  let a: string | null = ''; 
  if (aa !== null) {
    a = getStringNoLocale(aa, SCHEMA_INRUPT.name);
  }

  console.log(a)


  let courseSolidDataset = createSolidDataset();
  const newBookThing1 = buildThing(createThing({ name: "book1" }))
    .addUrl(RDF.type, "https://schema.org/Book")
    .addStringNoLocale(SCHEMA_INRUPT.name, "ABC123 of Example Literature")
    .addStringNoLocale(SCHEMA_INRUPT.Person, "kokotko")
    .build();

  const newBookThing3 = buildThing(createThing({ name: "kniiha" }))
    .addUrl(RDF.type, "https://schema.org/Book")
    .addStringNoLocale(SCHEMA_INRUPT.name, "Tisivc a jenda chcanka")
    .addStringNoLocale(SCHEMA_INRUPT.Person, "tarzan")
    .build();

    courseSolidDataset = setThing(courseSolidDataset, newBookThing1);
    courseSolidDataset = setThing(courseSolidDataset, newBookThing3);
    const savedSolidDataset = await saveSolidDatasetAt(
      "https://matejikj.inrupt.net/test/set1/dataset.ttl",
      courseSolidDataset,
      { fetch: fetch }
    );
    const savedSolidDataset1 = await saveSolidDatasetAt(
      "https://matejikj.inrupt.net/test/set2/dataset.ttl",
      courseSolidDataset,
      { fetch: fetch }
    );
}
