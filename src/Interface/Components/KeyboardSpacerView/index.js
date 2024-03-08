import React, { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';

import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').KeyboardEvent} KeyboardEvent
 */

/**
 * @description Thanks to this component, the page will scroll when the keyboard is displayed.
 * @see https://stackoverflow.com/a/60682069
 * 
 * @param {Object} props
 * @param {StyleProp} [props.style]
 */
function KeyboardSpacerView(props) {
    const [height, setHeight] = useState(0);
    let lastHeight = 0;

    useEffect(() => {
        const eventDidShow = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        const eventDidHide = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

        return ()=>{
            Keyboard.removeSubscription(eventDidShow);
            Keyboard.removeSubscription(eventDidHide);
        }
    }, []);

    /** @param {KeyboardEvent} event */
    const keyboardDidShow = (event) => {
        const newHeight = event.endCoordinates.height;
        setHeight(newHeight / 2);
        lastHeight = newHeight / 2;
        setTimeout(() => {
            user.interface.GetCurrentPage()?.refPage?.GoToYRelative(-newHeight / 2);
        }, 100);
    }

    /** @param {KeyboardEvent} event */
    const keyboardDidHide = (event) => {
        user.interface.GetCurrentPage()?.refPage?.GoToYRelative(lastHeight);
        setTimeout(() => {
            setHeight(0)
        }, 100);
    }

    const styleHeight = { height: height };

    return (
        <View style={[props.style, styleHeight]} />
    );
}

export default KeyboardSpacerView;
