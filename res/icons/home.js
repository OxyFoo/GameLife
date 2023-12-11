import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
    return (
        <Svg viewBox='0 0 24 24' {...props}>
            <Path
                opacity={0.3}
                fill={props.color || 'white'}
                d='M7 10.1899V17.9999H9V11.9999H15V17.9999H17V10.1899L12 5.68994L7 10.1899ZM14 9.99994H10C10 8.89994 10.9 7.99994 12 7.99994C13.1 7.99994 14 8.89994 14 9.99994Z'
            />
            <Path
                fill={props.color || 'white'}
                d='M19 9.3V4H16V6.6L12 3L2 12H5V20H11V14H13V20H19V12H22L19 9.3ZM17 18H15V12H9V18H7V10.19L12 5.69L17 10.19V18Z'
            />
            <Path
                fill={props.color || 'white'}
                d='M10 10H14C14 8.9 13.1 8 12 8C10.9 8 10 8.9 10 10Z'
            />
        </Svg>
    )
}

export default SvgComponent;
