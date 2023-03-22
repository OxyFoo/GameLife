import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SvgComponent = (props) => (
    <Svg viewBox='0 0 60 30' {...props}>
        <Path d='M0,0 v30 h60 v-30 z' fill='#012169' />
        <Path d='M0,0 L60,30 M60,0 L0,30' stroke='#fff' strokeWidth={6} />
        <Path
            d='M0,0 L60,30 M60,0 L0,30'
            clipPath='url(#t)'
            stroke='#C8102E'
            strokeWidth={4}
        />
        <Path d='M30,0 v30 M0,15 h60' stroke='#fff' strokeWidth={10} />
        <Path d='M30,0 v30 M0,15 h60' stroke='#C8102E' strokeWidth={6} />
    </Svg>
);

export default SvgComponent;