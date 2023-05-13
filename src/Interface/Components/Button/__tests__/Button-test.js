import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Note: test renderer must be required after react-native.
import renderer, { create } from 'react-test-renderer';

// Graphical components
import Button from '../Button';

describe('[Component] Button', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<Button>Test</Button>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('event onPress', () => {
        const onPress = jest.fn();
        const { root } = create(<Button onPress={onPress}>Test</Button>);

        fireEvent.press(root);

        expect(root).toBeTruthy();
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});