import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function SvgComponent(props) {
    return (
        <Svg viewBox='0 0 33 33' {...props}>
            <Path
                fill={props.color || 'white'}
                d='M14.875 8.375H18.125V11.625H14.875V8.375ZM14.875 14.875H18.125V24.625H14.875V14.875ZM16.5 0.25C7.53 0.25 0.25 7.53 0.25 16.5C0.25 25.47 7.53 32.75 16.5 32.75C25.47 32.75 32.75 25.47 32.75 16.5C32.75 7.53 25.47 0.25 16.5 0.25ZM16.5 29.5C9.33375 29.5 3.5 23.6663 3.5 16.5C3.5 9.33375 9.33375 3.5 16.5 3.5C23.6663 3.5 29.5 9.33375 29.5 16.5C29.5 23.6663 23.6663 29.5 16.5 29.5Z'
            />
        </Svg>
    )
}

export default SvgComponent;