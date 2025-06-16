import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';

// Graphical components
import { Text } from '../index';

describe('[Component] Text', () => {
    it('should render correctly', () => {
        const { toJSON } = render(<Text />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('should render the correct text content', () => {
        const textContent = 'Hello, World!';
        const { getByText } = render(<Text>{textContent}</Text>);
        const textElement = getByText(textContent);

        expect(textElement).toBeDefined();
    });

    it('should have the correct styles applied', () => {
        const { getByText } = render(<Text style={{ color: 'red', fontSize: 16 }}>Styled Text</Text>);
        const textElement = getByText('Styled Text');

        // Get only user-defined styles
        const textStyle = textElement.props.style.at(-1);
        expect(textStyle).toEqual({ color: 'red', fontSize: 16 });
    });
});
