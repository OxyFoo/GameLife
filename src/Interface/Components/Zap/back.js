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
 * @typedef {keyof ZAP_IMAGES[keyof ZAP_IMAGES]} ZapMode
 * @typedef {keyof ZAP_IMAGES} ZapColor
 * @typedef {'onTwoLegs' | 'onFourLegs'} ZapInclinaison
 * @typedef {'face' | 'show'} ZapFace
 * @typedef {'left' | 'right'} ZapOrientation
 */

const ZapProps = {
    /** @type {StyleAnimProp} */
    style: {},

    /** @type {AnimatedValueXY | null} */
    position: null,

    /** @type {'auto' | ZapMode} */
    mode: 'auto',

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

    static isNightTime = () => {
        const hour = GetDate().getHours();
        return hour >= 20 || hour <= 8;
    };

    static isChristmasSeason = () => {
        const month = GetDate().getMonth();
        return month === 11;
    };

    getZapImage = () => {
        const { mode, color, inclinaison, face } = this.props;

        /** @type {ZapColor} */
        let _color = 'day';

        if (color === 'auto') {
            if (ZapBack.isNightTime()) {
                _color = 'night';
            }
        } else {
            _color = color;
        }

        /** @type {ZapMode} */
        let _mode = 'normal';
        if (mode === 'auto') {
            if (ZapBack.isChristmasSeason()) {
                _mode = 'christmas';
            }
        } else {
            _mode = mode;
        }

        return ZAP_IMAGES[_color][_mode][inclinaison][face];
    };

    static getHighZapImage = () => {
        const mode = ZapBack.isChristmasSeason() ? 'christmas' : 'normal';
        const color = ZapBack.isNightTime() ? 'night' : 'day';
        return ZAP_IMAGES[color][mode]['high'];
    };
}

ZapBack.prototype.props = ZapProps;
ZapBack.defaultProps = ZapProps;

export default ZapBack;
