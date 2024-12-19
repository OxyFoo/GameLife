import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg
   
    fill='none'
    viewBox='0 0 24 24'
    {...props}
  >
    <Path
      fill='url(#a)'
      d='M19.582 18.52A9.96 9.96 0 0 0 22 12a9.96 9.96 0 0 0-2.418-6.52l-4.273 4.272A3.98 3.98 0 0 1 16 12c0 .834-.255 1.607-.691 2.248l4.273 4.273Z'
    />
    <Path
      fill='url(#b)'
      d='M18.52 19.582A9.96 9.96 0 0 1 12 22a9.96 9.96 0 0 1-6.52-2.418l4.272-4.273A3.98 3.98 0 0 0 12 16c.834 0 1.607-.255 2.248-.691l4.273 4.273Z'
    />
    <Path
      fill='url(#c)'
      d='m4.418 18.52 4.273-4.272A3.981 3.981 0 0 1 8 12c0-.834.255-1.607.691-2.248L4.418 5.479A9.96 9.96 0 0 0 2 12a9.96 9.96 0 0 0 2.418 6.52Z'
    />
    <Path
      fill='url(#d)'
      d='M12 8c-.834 0-1.607.255-2.248.691L5.479 4.418A9.96 9.96 0 0 1 12 2a9.96 9.96 0 0 1 6.52 2.418l-4.272 4.273A3.981 3.981 0 0 0 12 8Z'
    />
    <Defs>
      <LinearGradient
        id='a'
        x1={2}
        x2={22}
        y1={22}
        y2={2}
        gradientUnits='userSpaceOnUse'
      >
        <Stop stopColor='#DBA1FF' />
        <Stop offset={1} stopColor='#8CF7FF' />
      </LinearGradient>
      <LinearGradient
        id='b'
        x1={2}
        x2={22}
        y1={22}
        y2={2}
        gradientUnits='userSpaceOnUse'
      >
        <Stop stopColor='#DBA1FF' />
        <Stop offset={1} stopColor='#8CF7FF' />
      </LinearGradient>
      <LinearGradient
        id='c'
        x1={2}
        x2={22}
        y1={22}
        y2={2}
        gradientUnits='userSpaceOnUse'
      >
        <Stop stopColor='#DBA1FF' />
        <Stop offset={1} stopColor='#8CF7FF' />
      </LinearGradient>
      <LinearGradient
        id='d'
        x1={2}
        x2={22}
        y1={22}
        y2={2}
        gradientUnits='userSpaceOnUse'
      >
        <Stop stopColor='#DBA1FF' />
        <Stop offset={1} stopColor='#8CF7FF' />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SvgComponent;
