import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SvgComponent = (props) => (
    <Svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' {...props}>
        <Path
            fill={props.color || 'white'}
            transform='scale(7.14)'
            d='M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z'
        />
    </Svg>
);

export default SvgComponent;