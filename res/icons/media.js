import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
    return (
        <Svg viewBox='0 0 22 22' fill='none' {...props}>
            <Path
                stroke={props.color || 'white'}
                strokeLinejoin='round'
                strokeWidth={2}
                d='M1 7.25h7.222m0 0H21m-12.778 0L13.778 1m0 0h3.666c1.163 0 1.783 0 2.247.222M13.778 1H4.556c-1.245 0-1.867 0-2.343.272a2.38 2.38 0 0 0-.97 1.093C1 2.9 1 3.6 1 5v12c0 1.4 0 2.1.242 2.635.213.47.553.853.971 1.092C2.69 21 3.311 21 4.556 21h12.888c1.245 0 1.867 0 2.343-.273a2.38 2.38 0 0 0 .97-1.092C21 19.1 21 18.4 21 17V5c0-1.4 0-2.1-.242-2.635a2.38 2.38 0 0 0-.971-1.093 1.438 1.438 0 0 0-.096-.05m0 0L14.333 7.25M7.667 1 2.11 7.25m12.222 6.875-5.555 3.75v-7.5l5.555 3.75Z'
            />
        </Svg>
    );
}

export default SvgComponent;