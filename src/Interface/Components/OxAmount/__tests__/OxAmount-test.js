import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';

import { OxAmount } from '../index';

describe('[Component] OxAmount', () => {
    it('renders a balance without a sign', () => {
        const { getByText } = render(<OxAmount value={1250} />);
        expect(getByText('1250')).toBeTruthy();
    });

    it('renders a negative balance as is', () => {
        const { getByText } = render(<OxAmount value={-120} />);
        expect(getByText('-120')).toBeTruthy();
    });

    it('signs a change with a plus or a minus', () => {
        expect(render(<OxAmount value={60} signed />).getByText('+ 60')).toBeTruthy();
        expect(render(<OxAmount value={-45} signed />).getByText('− 45')).toBeTruthy();
        expect(render(<OxAmount value={0} signed />).getByText('+ 0')).toBeTruthy();
    });

    it('renders correctly', () => {
        const { toJSON } = render(<OxAmount value={-45} signed />);
        expect(toJSON()).toMatchSnapshot();
    });
});
