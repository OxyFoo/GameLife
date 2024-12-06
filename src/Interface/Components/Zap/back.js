import * as React from 'react';

import { GetDate } from 'Utils/Time';
import ZAP_IMAGES from 'Ressources/zap/zap';

/**
 * @typedef {import('react-native').Animated.ValueXY} AnimatedValueXY
 * @typedef {import('react-native').Animated.WithAnimatedObject<import('react-native').ImageStyle>} StyleAnimProp
 *
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {'day' | 'night'} ZapColor
 * @typedef {'onTwoLegs' | 'onFourLegs'} ZapInclinaison
 * @typedef {'face' | 'show'} ZapFace
 * @typedef {'left' | 'right'} ZapOrientation
 */

const ZapProps = {
    /** @type {StyleAnimProp} */
    style: {},

    /** @type {AnimatedValueXY | null} */
    position: null,

    /** @type {'auto' | ZapColor} */
    color: 'auto',

    /** @type {ZapInclinaison} */
    inclinaison: 'onTwoLegs',

    /** @type {ZapFace} */
    face: 'face',

    /** @type {ZapOrientation} */
    orientation: 'right',

    /** @type {(event: LayoutChangeEvent) => void} */
    onLayout: () => {}
};

class ZapBack extends React.Component {
    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        this.props.onLayout(event);
    };

    getZapImage = () => {
        const { color, inclinaison, face } = this.props;

        /** @type {ZapColor} */
        let _color = 'day';

        if (color === 'auto') {
            const isNight = GetDate().getHours() >= 20 || GetDate().getHours() <= 8;
            if (isNight) {
                _color = 'night';
            }
        }

        return ZAP_IMAGES[_color][inclinaison][face];
    };

    static getHighZapImage = () => {
        const isNight = GetDate().getHours() >= 20 || GetDate().getHours() <= 8;
        const color = isNight ? 'night' : 'day';
        return ZAP_IMAGES[color]['high'];
    };
}

ZapBack.prototype.props = ZapProps;
ZapBack.defaultProps = ZapProps;

export default ZapBack;
