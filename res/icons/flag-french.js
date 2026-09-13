import * as React from 'react';
import Svg, { Rect } from 'react-native-svg';

/** @param {import('react-native-svg').SvgProps} props */
const SvgComponent = (props) => (
    <Svg viewBox='0 0 9 6' {...props}>
        <Rect width={9} height={6} fill='#ED2939' />
        <Rect width={6} height={6} fill='#fff' />
        <Rect width={3} height={6} fill='#002395' />
    </Svg>
);

export default SvgComponent;
