import * as React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

function SvgComponent(props) {
    const color = props.color || '#FFFFFF';
    return (
        <Svg viewBox='0 0 462 462' {...props}>
            <Circle
                fill='none'
                stroke={color}
                strokeWidth={30}
                cx={231}
                cy={231}
                r={200}
            />
            <Path
                fill={color}
                d='M231,156c41.4,0,75,33.6,75,75s-33.6,75-75,75s-75-33.6-75-75S189.6,156,231,156 M231,131c-55.2,0-100,44.8-100,100c0,55.2,44.8,100,100,100s100-44.8,100-100C331,175.8,286.2,131,231,131L231,131z'
            />
            <Rect
                x={294.9}
                y={112.8}
                transform='matrix(-0.7071 -0.7071 0.7071 -0.7071 445.917 468.4722)'
                fill={color}
                width={50.2}
                height={58.2}
            />
            <Rect
                x={116.9}
                y={290.9}
                transform='matrix(-0.7071 -0.7071 0.7071 -0.7071 16.2201 646.6413)'
                fill={color}
                width={50.2}
                height={58.2}
            />
            <Rect
                x={294.9}
                y={290.9}
                transform='matrix(0.7071 -0.7071 0.7071 0.7071 -132.5323 319.9614)'
                fill={color}
                width={50.2}
                height={58.2}
            />
            <Rect
                x={116.8}
                y={112.8}
                transform='matrix(0.7071 -0.7071 0.7071 0.7071 -58.7701 141.8836)'
                fill={color}
                width={50.2}
                height={58.2}
            />
        </Svg>
    )
}

export default SvgComponent;
