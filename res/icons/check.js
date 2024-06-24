import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg viewBox='0 0 24 24' {...props}>
    <Path d='M20.06 8.06a1.5 1.5 0 1 0-2.12-2.12L9 14.88l-2.94-2.94a1.5 1.5 0 0 0-2.12 2.12l4 4a1.5 1.5 0 0 0 2.12 0l10-10Z' />
  </Svg>
);
export default SvgComponent;
