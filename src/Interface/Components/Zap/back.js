import * as React from 'react';

import { GetDate } from 'Utils/Time';
import { Random } from 'Utils/Functions';
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
 * @typedef {'up' | 'high' | 'firefly' | 'upThumb'} ZapPose Simple poses, drawn as is
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

    /**
     * Simple pose drawn as is, `null` to follow `inclinaison` and `face`
     * @type {ZapPose | null}
     */
    pose: null,

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
        const { mode, color, inclinaison, face, pose } = this.props;

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

        if (pose !== null) {
            return ZAP_IMAGES[_color][_mode][pose];
        }
        return ZAP_IMAGES[_color][_mode][inclinaison][face];
    };

    /** Poses drawn at random to celebrate (activity created): the usual one and the two cheering ones */
    static celebrationPoses = /** @type {ZapPose[]} */ (['up', 'firefly', 'upThumb']);

    /** @returns {ZapPose} */
    static GetRandomCelebrationPose = () => {
        return ZapBack.celebrationPoses[Random(0, ZapBack.celebrationPoses.length)];
    };

    /** @returns {ZapOrientation} Left or right, one chance in two */
    static GetRandomOrientation = () => {
        return Random(0, 2) === 0 ? 'left' : 'right';
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
