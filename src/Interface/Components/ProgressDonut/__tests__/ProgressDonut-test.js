import * as React from 'react';
import { Animated } from 'react-native';
import { render } from '@testing-library/react-native';

import { ProgressDonut } from '../index';

describe('[Component] ProgressDonut', () => {
    it('grows from an empty ring on mount, taking the entrance delay', () => {
        const timing = jest.spyOn(Animated, 'timing');
        render(<ProgressDonut value={0.2} delay={200} />);

        expect(timing).toHaveBeenCalledTimes(1);
        expect(timing.mock.calls[0][1]).toMatchObject({ toValue: 0.2, delay: 200 });
        timing.mockRestore();
    });

    it('animates from where the ring already is when the value changes', () => {
        // The raid widget of the home feeds it a live value: during a heal phase `outerValue` moves
        // on every minute tick. Resetting to zero each time collapsed and refilled the ring.
        const setValue = jest.spyOn(Animated.Value.prototype, 'setValue');
        const timing = jest.spyOn(Animated, 'timing');

        const { rerender } = render(<ProgressDonut value={0.2} delay={200} />);
        setValue.mockClear();

        rerender(<ProgressDonut value={0.6} delay={200} />);

        expect(setValue).not.toHaveBeenCalled();
        expect(timing.mock.calls[1][1]).toMatchObject({ toValue: 0.6, delay: 0 });

        setValue.mockRestore();
        timing.mockRestore();
    });
});
