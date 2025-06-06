import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
    return (
        <Svg viewBox="0 0 36 36" {...props}>
            <Path
                fill={props.color || 'white'}
                d="M31.47 3.84a5.78 5.78 0 0 0-7.37-.63 16.08 16.08 0 0 1 8.2 7.65 5.73 5.73 0 0 0-.83-7.02ZM11.42 3.43a5.77 5.77 0 0 0-7.64.41 5.72 5.72 0 0 0-.38 7.64 16.08 16.08 0 0 1 8.02-8.05Z"
            />
            <Path
                fill={props.color || 'white'}
                d="M18 4a14 14 0 0 0-9.89 23.88l-2.55 2.55A1 1 0 1 0 7 31.84l2.66-2.66a13.9 13.9 0 0 0 16.88-.08l2.74 2.74a1 1 0 0 0 1.41-1.41L28 27.78A14 14 0 0 0 18 4Zm7.47 17.43a1 1 0 0 1-1.33.47L17 18.44V9.69a1 1 0 0 1 2 0v7.5l6 2.91a1 1 0 0 1 .49 1.33Z"
            />
        </Svg>
    );
}

export default SvgComponent;
