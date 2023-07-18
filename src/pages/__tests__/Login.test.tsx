import React from 'react';
import { RenderResult, render, fireEvent } from '@testing-library/react';
import LoginPage from '../LoginPage';
import { login } from "@inrupt/solid-client-authn-browser";

jest.mock("@inrupt/solid-client-authn-browser", () => {
  return {
    __esModule: true,
    login: jest.fn(),
  };
});

describe("<Login />", () => {
  let loginComponent: RenderResult;

  beforeEach(() => {
    loginComponent = render(<LoginPage />);
  });

  test("Renders without issue", async () => {
    expect(loginComponent).not.toBeUndefined();
  });

  test("Displays login form", () => {
    const { getByLabelText, getByText } = loginComponent;

    // Assert the presence of form elements
    expect(getByLabelText("Default select example")).toBeInTheDocument();
    expect(getByText("LOGIN")).toBeInTheDocument();
  });

  test("Updates currentProvider state on form select change", () => {
    const { getByLabelText } = loginComponent;
    const selectElement = getByLabelText("Default select example") as HTMLSelectElement;

    // Simulate select value change
    fireEvent.change(selectElement, { target: { value: "https://inrupt.net" } });

    // Assert the updated state value
    expect(selectElement.value).toBe("https://inrupt.net");
  });

  test("Calls login function on button click", () => {
    const { getByText } = loginComponent;
    const loginButton = getByText("LOGIN");

    // Simulate button click
    fireEvent.click(loginButton);

    // Assert that the login function was called
    expect(login).toHaveBeenCalledWith({ oidcIssuer: "" });
  });
});
