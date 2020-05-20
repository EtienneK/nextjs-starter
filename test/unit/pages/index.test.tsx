/**
 * @jest-environment jsdom
*/
import React from 'react';
import { mount } from 'enzyme';
import Home from '../../../pages/index';

describe('Unit tests for path: /', () => {
  test('Should display', () => {
    const wrapper = mount(<Home />);
    expect(wrapper.text()).toContain('Next.js Starter');
  });
});
