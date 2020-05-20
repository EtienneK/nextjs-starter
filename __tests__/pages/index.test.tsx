/**
 * @jest-environment jsdom
*/
import React from 'react';
import { mount } from 'enzyme';
import Home from '../../pages/index';

test('hello world', () => {
  const wrapper = mount(<Home />);
  expect(wrapper.text()).toContain('Next.js Starter');
});
