import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Graphical components
import { InputText } from '../index';

describe('[Component] InputText', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<InputText />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('should update the input value when typed', () => {
        let [value, setValue] = [
            '',
            (v = '') => {
                value = v;
            }
        ];
        const { getByTestId } = render(<InputText value={value} onChangeText={setValue} />);

        const input = getByTestId('textInput');
        fireEvent.changeText(input, 'Hello, World!');
        expect(value).toBe('Hello, World!');
    });

    it('should call a callback function when submitted', () => {
        const onSubmitMock = jest.fn();
        const { getByTestId } = render(<InputText onSubmit={onSubmitMock} />);

        const input = getByTestId('textInput');
        fireEvent(input, 'submitEditing');
        expect(onSubmitMock).toHaveBeenCalled();
    });
});
