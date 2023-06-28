import React from 'react';
import { render } from '@testing-library/react';
import Sidenav, { SideNavType } from '../Sidenav';

window.matchMedia = window.matchMedia || function() {
  return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
  };
};

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

test('renders learn react link', () => {
  render(<Sidenav type={SideNavType.COMMON} />);
});
