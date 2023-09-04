import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SvgComponent = (props) => (
    <Svg fill='none' viewBox="0 0 24 24" {...props}>
        <Path
            stroke={props.color || 'white'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 10h13a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-5"
        />
        <Path
            stroke={props.color || 'white'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m7 6-4 4 4 4"
        />
    </Svg>
);

export default SvgComponent;