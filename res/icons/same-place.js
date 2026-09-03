import * as React from 'react';
import Svg, { Rect } from 'react-native-svg';
/** @param {import('react-native-svg').SvgProps} props */
const SvgComponent = (props) => (
  <Svg viewBox='0 0 24 24' {...props}>
    <Rect width={8} height={4} x={8} y={10} rx={2} />
  </Svg>
);
export default SvgComponent;
