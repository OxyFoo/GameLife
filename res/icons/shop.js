import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
    return (
        <Svg viewBox='0 0 60 60' {...props}>
            <Path fill={props.color || 'white'} d='M18 48c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm30 0c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm-4.3-15c2.2 0 4.2-1.2 5.2-3.1l10.7-19.5C60.8 8.5 59.3 6 57 6H12.6L9.8 0H0v6h6l10.8 22.8-4 7.3c-2.2 4 .7 8.9 5.2 8.9h36v-6H18l3.3-6h22.4zM15.5 12H52l-8.3 15H22.6l-7.1-15z' />
        </Svg>
    )
}

export default SvgComponent;
