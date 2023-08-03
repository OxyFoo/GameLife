import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" {...props}>
            <Path
                fill={props.color || 'white'}
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={12}
                d="M30 22h62L30 96h62m25-24h46l-46 55h46m-109 0h36l-36 43h36"
            />
        </Svg>
    );
}

export default SvgComponent;
