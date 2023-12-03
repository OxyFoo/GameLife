import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// Graphical components
import ComboBox from '../index';

const options = [
    { key: 'Option 1', value: 'Option 1' },
    { key: 'Option 2', value: 'Option 2' },
    { key: 'Option 3', value: 'Option 3' }
];

describe('[Component] Input', () => {
    it('should render correctly', () => {
        const tree = renderer.create(<ComboBox />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render the options correctly', () => {
        const { getByText, queryByText } = render(
            <ComboBox data={options} />
        );

        options.forEach((option) => {
            const optionElement = getByText(option.value);
            expect(optionElement).toBeDefined();
        });

        const nonExistentOption = queryByText('Non-Existent Option');
        expect(nonExistentOption).toBeNull();
    });

    it('should call a callback function when an option is selected', () => {
        const onSelectMock = jest.fn();
        const { getByText, getByTestId } = render(
            <ComboBox data={options} onSelect={onSelectMock} />
        );

        const buttonCombobox = getByTestId('combobox-button');
        const optionElement = getByText('Option 2');

        // Open the dropdown
        fireEvent.press(buttonCombobox);

        // Select the option
        fireEvent.press(optionElement);

        expect(onSelectMock).toHaveBeenCalledWith(options[1]);
    });
});
