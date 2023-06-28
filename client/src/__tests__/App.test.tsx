import { TextDecoder, TextEncoder } from 'util'
global.TextEncoder = TextEncoder
// @ts-expect-error
global.TextDecoder = TextDecoder

import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';


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
  console.log(TextDecoder)
  Object.assign(global, { TextDecoder, TextEncoder });

  render(<App/>);
});
