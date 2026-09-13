import * as React from 'react';
import { Dimensions } from 'react-native';
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

    it('lays the artwork edge to edge at the top, at its own ratio', () => {
        const { UNSAFE_getByType } = render(<ImageBackdrop source={{ uri: 'boss.png', width: 4000, height: 4000 }} />);

        const image = UNSAFE_getByType(require('react-native-svg').Image);
        expect(image.props.y).toBe('0');
        expect(image.props.width).toBe('100%');
        expect(image.props.preserveAspectRatio).toBe('xMidYMin slice');
        // A square boss takes exactly the width of the page, never the 4000dp of the asset
        expect(image.props.height).toBe(Dimensions.get('window').width);
    });

    it('covers the page when the source carries no size, rather than collapsing to nothing', () => {
        const { UNSAFE_getByType } = render(<ImageBackdrop source={SOURCE} />);

        const image = UNSAFE_getByType(require('react-native-svg').Image);
        expect(image.props.height).toBe('100%');
    });
});
