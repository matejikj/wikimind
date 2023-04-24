import { handleIncomingRedirect, login, fetch, getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { getSolidDataset, saveSolidDatasetAt } from "@inrupt/solid-client";

async function loginAndFetch() {
  // 1. Call the handleIncomingRedirect() function,
  //    - Which completes the login flow if redirected back to this page as part of login; or
  //    - Which is a No-op if not part of login.
  await handleIncomingRedirect();

  // 2. Start the Login Process if not already logged in.
  if (!getDefaultSession().info.isLoggedIn) {
    await login({
      oidcIssuer: "https://login.inrupt.com",
      redirectUrl: window.location.href,
      clientName: "My application"
    });
  }

  // ...
  // const exampleSolidDatasetURL = ...;
  
  // 3. Make authenticated requests by passing `fetch` to the solid-client functions.
  // For example, the user must be someone with Read access to the specified URL.
  const myDataset = await getSolidDataset(
    exampleSolidDatasetURL, 
    { fetch: fetch }  // fetch function from authenticated session
  );

  // ...
  
  // For example, the user must be someone with Write access to the specified URL.
  const savedSolidDataset = await saveSolidDatasetAt(
    exampleSolidDatasetURL,
    myChangedDataset,
    { fetch: fetch }  // fetch function from authenticated session
  );
}

loginAndFetch();
