import React from 'react';
import { Animated } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import { ItemStatsTicker } from '../Ticker';

// jest.setup.js replaces Animated.timing by a bare object: the real Animated.loop cannot drive it
const loop = jest.spyOn(Animated, 'loop').mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn()
}));
afterAll(() => loop.mockRestore());

/** The percent badges on screen: one per stat per copy of the line */
const badges = (/** @type {ReturnType<typeof render>} */ screen) => screen.getAllByText(/^\+\d+ %$/);

describe('ItemStatsTicker', () => {
    test('shows the line once when it fits in its box', () => {
        const screen = render(<ItemStatsTicker stats={{ for: 5, agi: 3 }} width={300} />);
        fireEvent(screen.getByTestId('item-stats-line'), 'layout', {
            nativeEvent: { layout: { width: 120, height: 18 } }
        });
        expect(badges(screen)).toHaveLength(2);
    });

    test('lays the line out exactly twice when it overflows, never more', () => {
        const screen = render(<ItemStatsTicker stats={{ for: 5, agi: 3, int: 2 }} width={100} />);
        fireEvent(screen.getByTestId('item-stats-line'), 'layout', {
            nativeEvent: { layout: { width: 180, height: 18 } }
        });
        expect(badges(screen)).toHaveLength(6);
        // One native loop of one timing, started once; it never adds anything to the tree
        expect(loop).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(30000);
        expect(badges(screen)).toHaveLength(6);
    });

    test('renders an empty line for a copy without stats', () => {
        const screen = render(<ItemStatsTicker stats={{}} width={100} />);
        expect(screen.queryAllByText(/%/)).toHaveLength(0);
    });
});
