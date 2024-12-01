import React, { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').KeyboardEvent} KeyboardEvent
 *
 * @typedef {(state: 'opened' | 'closed', height: number) => void} KeyboardChangeStateEvent
 */

/**
 * @description Thanks to this component, the page will scroll when the keyboard is displayed.
 * @see https://stackoverflow.com/a/60682069
 *
 * @param {Object} props
 * @param {StyleProp} [props.style]
 * @param {number} [props.offset]
 * @param {KeyboardChangeStateEvent} [props.onChangeState]
 */
const KeyboardSpacerView = (props) => {
    const [height, setHeight] = useState(0);

    useEffect(() => {
        /** @param {KeyboardEvent} event */
        const keyboardDidShow = (event) => {
            const newHeight = event.endCoordinates.height;
            const currHeight = newHeight / 2;
            setHeight(currHeight + (props.offset || 0));
            props.onChangeState?.('opened', currHeight);
        };

        /** @param {KeyboardEvent} _event */
        const keyboardDidHide = (_event) => {
            props.onChangeState?.('closed', height);
            setHeight(0);
        };

        const emitterDidShow = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        const emitterDidHide = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

        return () => {
            if (emitterDidShow) emitterDidShow.remove();
            if (emitterDidHide) emitterDidHide.remove();
        };
    }, [height, props]);

    return <View style={[props.style, { height }]} />;
};

export { KeyboardSpacerView };
