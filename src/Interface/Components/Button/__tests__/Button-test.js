import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Graphical components
import { Button } from 'Interface/Components';

describe('[Component] Button', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<Button>Test</Button>);
        expect(toJSON()).toMatchSnapshot();
    });

    it('event onPress', () => {
        const onPress = jest.fn();
        const { getByTestId } = render(
            <Button testID='button' onPress={onPress}>
                Test
            </Button>
        );

        const button = getByTestId('button');

        // Simulez les événements tactiles
        fireEvent(button, 'touchStart', {
            nativeEvent: { pageX: 100, pageY: 100, locationX: 50, locationY: 50 }
        });

        fireEvent(button, 'touchEnd', {
            nativeEvent: { pageX: 100, pageY: 100 }
        });

        // Vérifiez si onPress a été appelé
        expect(onPress).toHaveBeenCalledTimes(1);
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
