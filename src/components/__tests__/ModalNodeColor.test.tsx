import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import ModalNodeColor from '../ModalNodeColor';
import { Node } from '../../models/types/Node';

const mockNode: Node = {
    id: "node1",
    cx: 10,
    cy: 20,
    title: "Node Title",
    uri: "https://example.com/node1",
    description: "Node Description",
    textColor: "#000000",
    color: "#FFFFFF",
    isInTest: true
}

describe('<ModalNodeColor />', () => {
  let renderResult: RenderResult;
  let setModal: jest.Mock;
  let changeTextColor: jest.Mock;

  beforeEach(() => {
    setModal = jest.fn();
    changeTextColor = jest.fn();

    renderResult = render(
      <ModalNodeColor
        node={mockNode}
        showModal={true}
        setModal={setModal}
      />
    );
  });

  test('Renders without issue', () => {
    expect(renderResult).toBeDefined();
  });

  test('Calls setModal function on close button click', () => {
    const closeButton = renderResult.getByText('Close');
    fireEvent.click(closeButton);

    expect(setModal).toHaveBeenCalledTimes(1);
  });
  
});
