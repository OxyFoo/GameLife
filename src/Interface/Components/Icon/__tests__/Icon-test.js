import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// Graphical components
import { Icon } from '../index';

describe('[Component] Icon', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<Icon />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should call a callback function on icon click', () => {
        const onClickMock = jest.fn();
        const { root } = render(<Icon onPress={onClickMock} />);

        fireEvent.press(root);
        expect(onClickMock).toHaveBeenCalled();
    });
});
