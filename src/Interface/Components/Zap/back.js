import * as React from 'react';
import { Animated } from 'react-native';

import { GetDate } from 'Utils/Time';
import ZAP_IMAGES from 'Ressources/zap/zap';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {'auto' | 'day' | 'night'} ZapColor
 * @typedef {'onTwoLegs' | 'onFourLegs'} ZapInclinaison
 * @typedef {'face' | 'show'} ZapFace
 * @typedef {'left' | 'right'} ZapOrientation
 */

const ZapProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Animated.ValueXY | null} */
    position: null,

    /** @type {ZapColor} */
    color: 'auto',

    /** @type {ZapInclinaison} */
    inclinaison: 'onTwoLegs',

    /** @type {ZapFace} */
    face: 'face',

    /** @type {ZapOrientation} */
    orientation: 'right',

    /** @param {LayoutChangeEvent} event */
    onLayout: (event) => {}
};

class ZapBack extends React.Component {
    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        this.props.onLayout(event);
    }

    getZapImage = () => {
        const { color, inclinaison, face } = this.props;

        let _color = color;
        if (color === 'auto') {
            const isNight = GetDate().getHours() >= 20 || GetDate().getHours() <= 8;
            _color = isNight ? 'night' : 'day';
        }

        return ZAP_IMAGES[_color][inclinaison][face];
    }
}

ZapBack.prototype.props = ZapProps;
ZapBack.defaultProps = ZapProps;

export default ZapBack;
