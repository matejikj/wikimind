import React from 'react';
import { RenderResult, render } from '@testing-library/react';
import Sidenav from '../../components/Sidenav';
import { logout } from "@inrupt/solid-client-authn-browser";

jest.mock("@inrupt/solid-client-authn-browser", () => {
  return {
    __esModule: true,
    getDefaultSession: jest.fn(),
    handleIncomingRedirect: () => undefined,
    onLogin: () => undefined,
    onSessionRestore: () => undefined,
    logout: () => undefined
  };
});

window.matchMedia = window.matchMedia || function() {
  return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
  };
};



// jest.mock("../dynamic-handle-redirect-component", () => {
//   return {
//     DynamicHandleRedirectComponent: () => null,
//   };
// });

function Render(): RenderResult {
  return render(<Sidenav />);
}

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe("<Sidenav />", () => {

  test("Renders without issue", async () => {
    const sidenav = Render();
    expect(sidenav).not.toBeUndefined();
  });


})