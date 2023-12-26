import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SvgComponent = (props) => (
    <Svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' {...props}>
        <Path
            fill={props.color || 'white'}
            d='M17.92 9C17.96 9.33 18 9.66 18 10C18 12.08 17.2 13.97 15.9 15.39C15.64 14.58 14.9 14 14 14H13V11C13 10.45 12.55 10 12 10H6V8H8C8.55 8 9 7.55 9 7V5H11C12.1 5 13 3.6 13 2.5V0.46C12.05 0.16 11.05 0 10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 9.66 19.98 9.33 19.95 9H17.92ZM9 17.93C5.05 17.44 2 14.08 2 10C2 9.38 2.08 8.79 2.21 8.21L7 13V14C7 15.1 7.9 16 9 16V17.93Z'
        />
    </Svg>
);

export default SvgComponent;
