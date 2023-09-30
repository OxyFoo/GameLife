import * as React from 'react';
import Svg, { Defs, G, LinearGradient, Stop, Rect, Path, Circle } from 'react-native-svg';

const SvgComponent = (props) => (
    <Svg width={241} height={201} viewBox='0 0 241 201' {...props}>
        <Defs>
            <LinearGradient
                id='paint0_linear_764_3392'
                x1={74}
                y1={113}
                x2={193}
                y2={122}
                gradientUnits='userSpaceOnUse'
            >
                <Stop stopColor='#9095FF' />
                <Stop offset={1} stopColor='#DBA1FF' />
            </LinearGradient>
            <LinearGradient
                id='paint1_linear_764_3392'
                x1={94.5}
                y1={107.51}
                x2={254.5}
                y2={78.5096}
                gradientUnits='userSpaceOnUse'
            >
                <Stop stopColor='#8CF7FF' />
                <Stop offset={1} stopColor='#9095FF' />
            </LinearGradient>
        </Defs>
        <G transform="translate(-12 0)">
            <Rect
                x={74}
                y={63}
                width={119}
                height={119}
                rx={16}
                fill='url(#paint0_linear_764_3392)'
            />
            <Path
                d='M102 108.51C110.579 113.689 129.564 127.578 138.712 142.663C139.09 143.287 139.981 143.346 140.415 142.76C158.55 118.261 194.147 86.7479 232 72'
                stroke='url(#paint1_linear_764_3392)'
                strokeWidth={16}
                strokeLinecap='round'
            />
            <Circle cx={154} cy={39} r={6} fill='#7480E0' />
            <Circle cx={47} cy={120} r={8} fill='#7480E0' />
            <Circle cx={227} cy={106} r={6} fill='#E1C0FF' />
            <Circle cx={190.5} cy={11.5} r={3.5} fill='#8AE3E8' />
            <Circle cx={38.5} cy={103.5} r={3.5} fill='#8AE3E8' />
            <Path
                fill='white'
                d='M82.2093 75C82.2093 68.6364 74.0698 63.2576 70 61.3636C77.4419 61.3636 81.2403 53.7879 82.2093 50C82.2093 56.8182 90.7364 60.4167 95 61.3636C87.5581 61.3636 83.3721 70.4545 82.2093 75Z'
            />
            <Path
                fill='white'
                d='M204.326 83C204.326 79.1818 199.442 75.9545 197 74.8182C201.465 74.8182 203.744 70.2727 204.326 68C204.326 72.0909 209.442 74.25 212 74.8182C207.535 74.8182 205.023 80.2727 204.326 83Z'
            />
            <Path
                stroke='white'
                strokeWidth={4}
                strokeLinecap='round'
                d='M70.5295 9.30188C70.2569 14.7239 74.4724 25.9486 93.5155 27.4718C112.559 28.995 116.32 37.2357 115.82 41.1657'
            />
            <Path
                d='M204.5 170.94C210.833 172.273 223.4 179.74 223 198.94'
                stroke='white'
                strokeWidth={4}
                strokeLinecap='round'
            />
            <Path
                stroke='white'
                strokeWidth={4}
                strokeLinecap='round'
                d='M2 176.776C12.3333 180.443 34 182.976 38 163.776C39 160.443 39.6 152.876 34 149.276C27 144.776 21.5 153.276 28.5 157.776C34.1 161.376 51.5 157.276 59.5 154.776'
            />
        </G>
    </Svg>
);

export default SvgComponent;