import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg viewBox='0 0 24 24' {...props}>
    <Path d='M10.913 7.883a1.255 1.255 0 0 1 2.174 0l3.022 5.234A1.256 1.256 0 0 1 15.02 15H8.98a1.256 1.256 0 0 1-1.088-1.883l3.022-5.234Z' />
  </Svg>
);
export default SvgComponent;
