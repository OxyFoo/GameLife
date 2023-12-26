import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
    return (
        <Svg viewBox='0 0 1024 1024' {...props}>
            <Path
                fill={props.color || 'white'}
                d='M810.666 128H213.334C166.396 128 128 166.396 128 213.334v597.332C128 857.604 166.396 896 213.334 896h597.332C857.604 896 896 857.604 896 810.666V213.334C896 166.396 857.604 128 810.666 128z m-384 597.334L213.334 512l59.728-59.728 153.604 153.604 324.272-324.272 59.728 59.73-384 384z'
            />
        </Svg>
    )
}

export default SvgComponent;
