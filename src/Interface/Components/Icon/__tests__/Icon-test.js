import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Graphical components
import { Icon } from 'Interface/Components'

describe('[Component] Icon', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<Icon />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('should call a callback function on icon click', () => {
        const onClickMock = jest.fn();
        render(<Icon onPress={onClickMock} />);

        const iconElement = render(<Icon onPress={onClickMock} />).getByTestId('icon');
        fireEvent.press(iconElement);
        expect(onClickMock).toHaveBeenCalled();
    });
});
