import React from 'react'
import {render, screen} from '@testing-library/react'

import App from './App'

test('', () => {
  // jest.mock('react-redux', () => {
  //   const ActualReactRedux = jest.requireActual('react-redux');
  //   return {
  //     ...ActualReactRedux,
  //     useSelector: jest.fn().mockImplementation(() => {
  //       return mockState;
  //     }),
  //   };
  // });
  render(<App/>)
  const linkElement = screen.getByRole('div')
  expect(linkElement).toBeInTheDocument()
})