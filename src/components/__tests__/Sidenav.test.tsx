import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Sidenav from '../Sidenav';
import { useNavigate } from 'react-router-dom';
import { logout } from "@inrupt/solid-client-authn-browser";
import { SessionContext } from '../../sessionContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('@inrupt/solid-client-authn-browser', () => ({
  logout: jest.fn().mockResolvedValue(undefined),
}));

window.matchMedia = window.matchMedia || function() {
  return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
  };
};

// jest.mock('../../sessionContext', () => ({
//   SessionContext: {
//     sessionInfo: {
//       webId: 'https://example.com/johndoe',
//     },
//   },
// }));


describe('<Sidenav />', () => {
  const sessionContext = {
    setSessionInfo: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Renders without issue', () => {
    render(<Sidenav />);
  });

  // test('Calls navigate function on link click', () => {
  //   const navigate = jest.fn();
  //   (useNavigate as jest.Mock).mockReturnValue(navigate);

  //   const { getByText } = render(<Sidenav />);

  //   const homeLink = getByText('Home');
  //   fireEvent.click(homeLink);
  //   expect(useNavigate).toHaveBeenCalledWith('/');

  //   const profileLink = getByText('Profile');
  //   fireEvent.click(profileLink);
  //   expect(useNavigate).toHaveBeenCalledWith('/profile');

  //   const classesLink = getByText('Classes');
  //   fireEvent.click(classesLink);
  //   expect(useNavigate).toHaveBeenCalledWith('/classes');

  //   const messagesLink = getByText('Messages');
  //   fireEvent.click(messagesLink);
  //   expect(useNavigate).toHaveBeenCalledWith('/messages');
  // });

  // test('Calls logout function on logout link click', async () => {
  //   const { getByText } = render(
  //     <SessionContext.Provider value={sessionContext}>
  //       <Sidenav />
  //     </SessionContext.Provider>
  //   );

  //   const logoutLink = getByText('Logout');
  //   fireEvent.click(logoutLink);
  //   expect(logout).toHaveBeenCalled();

  //   await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the promise to resolve

  //   expect(sessionContext.setSessionInfo).toHaveBeenCalledWith({
  //     // webId: '',
  //     // podUrl: '',
  //     // isLogged: false,
  //     // podAccessControlPolicy: null,
  //   });
  // });
});
