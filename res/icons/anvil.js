import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

/** @param {import('react-native-svg').SvgProps} props */
const SvgComponent = (props) => (
    <Svg viewBox='0 0 22 22' {...props}>
        {/** An outline: the fill `Icon` hands to every icon must not close the shape */}
        <Path
            fill='none'
            stroke={props.color || 'white'}
            strokeWidth={2}
            d='M6.416 9.167H5.5A3.667 3.667 0 0 1 1.833 5.5a.917.917 0 0 1 .916-.916h3.667m0 0a.917.917 0 0 1 .917-.917h11.918a.917.917 0 0 1 .916.917A6.416 6.416 0 0 1 13.75 11M6.416 4.584v5.5a.916.916 0 0 0 .917.916h6.417m0 0v4.583M8.25 11v4.583m-3.667 2.75a2.75 2.75 0 0 1 2.75-2.75h7.334a2.75 2.75 0 0 1 2.75 2.75.917.917 0 0 1-.917.917h-11a.917.917 0 0 1-.917-.917Z'
        />
    </Svg>
);

export default SvgComponent;
