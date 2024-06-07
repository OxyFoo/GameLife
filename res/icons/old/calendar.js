import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
    return (
        <Svg viewBox='0 0 60 60' {...props}>
            <Path fill={props.color || 'white'} d='M53 2.4h-2.9V0h-5.8v2.4H15.6V0H9.8v2.4H7C3.8 2.4 1.2 5 1.2 8.2v46.1C1.2 57.4 3.8 60 7 60h46c3.2 0 5.8-2.6 5.8-5.8v-46c0-3.2-2.6-5.8-5.8-5.8zm0 5.8v8.6H7V8.2h46zm-46 46V22.6h46v31.7H7z' />
        </Svg>
    )
}

export default SvgComponent;
