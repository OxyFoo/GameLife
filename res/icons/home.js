import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
    return (
        <Svg viewBox='0 0 60 60' {...props}>
            <Path fill={props.color || 'white'} d='M51 22V7.5h-9v5.1L30 0 0 31.5h9V60h18V37.5h6V60h18V31.5h9L51 22zm-6 33.3h-6V32.7H21v22.6h-6V27.4l15-14.8 15 14.8v27.9z' />
            <Path fill={props.color || 'white'} d='M24 29.1h12c0-3.3-2.7-6-6-6s-6 2.7-6 6z' />
        </Svg>
    )
}

export default SvgComponent;
