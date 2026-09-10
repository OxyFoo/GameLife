import * as React from 'react';
import { render } from '@testing-library/react-native';

import { ImageBackdrop } from '../index';

const SOURCE = { uri: 'boss.png' };

describe('[Component] ImageBackdrop', () => {
    it('renders the image behind a gradient mask', () => {
        const { toJSON } = render(<ImageBackdrop source={SOURCE} />);
        expect(toJSON()).not.toBeNull();
    });

    it('gives each instance its own mask id: two backdrops coexist during a page transition', () => {
        const { UNSAFE_getAllByType } = render(
            <>
                <ImageBackdrop source={SOURCE} />
                <ImageBackdrop source={SOURCE} />
            </>
        );

        const masks = UNSAFE_getAllByType(require('react-native-svg').Mask);
        expect(masks).toHaveLength(2);
        expect(masks[0].props.id).not.toBe(masks[1].props.id);
    });
});
