/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import { act, create } from 'react-test-renderer';

// Graphical components
import { Button } from '../src/Interface/Components';
it('renders correctly', () => {
    const tree = create(<Button />).toJSON();
    expect(tree).toMatchSnapshot();
});