/**
 * @format
 */

import React from 'react';
import App from '../App';
import { render, waitFor } from '@testing-library/react-native';

it('should load app correctly', async () => {
    const { findByTestId } = render(<App />);

    const element = await waitFor(() => findByTestId('FlowEngine'));

    expect(element).toBeTruthy();
});
