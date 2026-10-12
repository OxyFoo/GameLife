import React from 'react';
import { Animated } from 'react-native';
import { render } from '@testing-library/react-native';

import { ForgeParticles } from '../ForgeParticles';

describe('ForgeParticles', () => {
    test('renders one dot per particle, all driven by the progress value', () => {
        const progress = new Animated.Value(0);
        const { toJSON } = render(<ForgeParticles progress={progress} color='#FFFFFF' count={7} />);
        const tree = toJSON();
        expect(tree).not.toBeNull();
        expect(Array.isArray(tree) ? tree : tree?.children).toHaveLength(7);
    });

    test('draws its directions once per mount', () => {
        const progress = new Animated.Value(0);
        const { toJSON, rerender } = render(<ForgeParticles progress={progress} color='#FFFFFF' count={5} />);
        const first = JSON.stringify(toJSON());
        rerender(<ForgeParticles progress={progress} color='#FFFFFF' count={5} />);
        expect(JSON.stringify(toJSON())).toBe(first);
    });
});
