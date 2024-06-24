import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg viewBox='0 0 24 24' {...props}>
    <Path d='M8.06 5.94a1.5 1.5 0 0 0-2.12 2.12L9.88 12l-3.94 3.94a1.5 1.5 0 1 0 2.12 2.12L12 14.12l3.94 3.94a1.5 1.5 0 0 0 2.12-2.12L14.12 12l3.94-3.94a1.5 1.5 0 1 0-2.12-2.12L12 9.88 8.06 5.94Z' />
  </Svg>
);
export default SvgComponent;
