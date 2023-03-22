import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
    return (
        <Svg viewBox='0 0 1024 1024' {...props}>
            <Path
                fill={props.color || 'white'}
                d='M227.487 892.447c-50.919 0-92.345-41.426-92.345-92.345V222.49c0-50.14 40.791-90.932 90.932-90.932h573.291c49.347 0 89.493 40.146 89.493 89.493V801.9c0 49.925-40.622 90.547-90.548 90.547H227.487z m11.197-706.74c-27.233 0-49.387 22.155-49.387 49.388v552.817c0 27.78 22.6 50.38 50.38 50.38h546.08c26.992 0 48.957-21.96 48.957-48.957V235.254c0-27.32-22.226-49.546-49.547-49.546H238.684z'
            />
        </Svg>
    )
}

export default SvgComponent;