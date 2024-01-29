import React, { useState } from 'react';
import { View } from 'react-native';

/**
 * @typedef {import('react-native').ViewProps} ViewProps
 */

/**
 * @param {ViewProps} props
 */
const SwiperView = (props) => {
    const [startTouch, setStartTouch] = useState({ x: 0, y: 0 });

    const handleStartShouldSetResponder = (event) => {
        setStartTouch({
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY
        });

        // Always return true, because we want to be the responder
        return true;
    };

    const handleMoveShouldSetResponder = (event) => {
        const deltaX = Math.abs(event.nativeEvent.pageX - startTouch.x);
        const deltaY = Math.abs(event.nativeEvent.pageY - startTouch.y);

        // If the user is scrolling vertically, we want to be the responder
        return deltaY > deltaX;
    };

    return (
        <View
            onStartShouldSetResponder={handleStartShouldSetResponder}
            onMoveShouldSetResponder={handleMoveShouldSetResponder}
            {...props}
        >
            {props.children}
        </View>
    );
};

export default SwiperView;
