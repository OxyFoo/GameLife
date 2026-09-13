import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
/** @param {import('react-native-svg').SvgProps} props */
const SvgComponent = (props) => (
    <Svg viewBox='0 0 24 24' {...props}>
        <Path d='M13 2 4 14h7l-1 8 10-13h-7l0-7z' />
    </Svg>
);
export default SvgComponent;
