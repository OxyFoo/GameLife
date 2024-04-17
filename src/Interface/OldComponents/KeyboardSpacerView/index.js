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
 * @param {KeyboardChangeStateEvent} [props.onChangeState]
 */
const KeyboardSpacerView = (props) => {
    const [height, setHeight] = useState(0);
    let currHeight = 0;

    /** @type {NodeJS.Timeout} */
    let timeout;

    useEffect(() => {
        const emitterDidShow = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        const emitterDidHide = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

        return () => {
            if (!!timeout) clearTimeout(timeout);
            if (!!emitterDidShow) emitterDidShow.remove();
            if (!!emitterDidHide) emitterDidHide.remove();
        }
    }, []);

    /** @param {KeyboardEvent} event */
    const keyboardDidShow = (event) => {
        const newHeight = event.endCoordinates.height;
        currHeight = newHeight / 2;
        setHeight(currHeight);
        props.onChangeState?.('opened', currHeight);
    }

    /** @param {KeyboardEvent} event */
    const keyboardDidHide = (event) => {
        props.onChangeState?.('closed', currHeight);
        timeout = setTimeout(() => {
            setHeight(0)
        }, 100);
    }

    return (
        <View style={[props.style, { height }]} />
    );
}

export default KeyboardSpacerView;
