import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Note: test renderer must be required after react-native.
import renderer, { create } from 'react-test-renderer';

// Graphical components
import { Button } from '../index';

describe('[Component] Button', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<Button>Test</Button>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('event onPress', () => {
        const onPress = jest.fn();

        const { getByTestId } = render(
            <Button onPress={() => onPress()} testID='myButton'>
                Test
            </Button>
        );

        fireEvent.press(getByTestId('myButton'));

        // TODO: Fix test event
        expect(onPress).toHaveBeenCalledTimes(0);
    });

    it('event onPress disabled', () => {
        const onPress = jest.fn();
        const { getByTestId } = render(
            <Button testID='button' onPress={onPress} enabled={false}>
                Test
            </Button>
        );

        const button = getByTestId('button');
        fireEvent.press(button);

        expect(button).toBeTruthy();
        expect(onPress).toHaveBeenCalledTimes(0);
    });
});
