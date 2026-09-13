import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
/** @param {import('react-native-svg').SvgProps} props */
const SvgComponent = (props) => (
  <Svg viewBox='0 0 12 14' {...props}>
    <Path d='m0 0 12 7-12 7V0Z' />
  </Svg>
);
export default SvgComponent;
