import * as React from 'react';
import { Animated } from 'react-native';

/**
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {'day' | 'night'} ZapColor
 * @typedef {'onTwoLegs' | 'onFourLegs'} ZapInclinaison
 * @typedef {'face' | 'show'} ZapFace
 * @typedef {'left' | 'right'} ZapOrientation
 */

const ZAP_IMAGES = {
    day: {
        onTwoLegs: {
            face: require('Ressources/zap/purple/up.png'),
            show: require('Ressources/zap/purple/upShow.png')
        },
        onFourLegs: {
            face: require('Ressources/zap/purple/down.png'),
            show: require('Ressources/zap/purple/downShow.png')
        }
    },
    night: {
        onTwoLegs: {
            face: require('Ressources/zap/black/up.png'),
            show: require('Ressources/zap/black/upShow.png')
        },
        onFourLegs: {
            face: require('Ressources/zap/black/down.png'),
            show: require('Ressources/zap/black/downShow.png')
        }
    }
};

const ZapProps = {
    /** @type {Animated.ValueXY} */
    position: new Animated.ValueXY({ x: 0, y: 0 }),

    /** @type {ZapColor} */
    color: 'day',

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
        return ZAP_IMAGES[color][inclinaison][face];
    }
}

ZapBack.prototype.props = ZapProps;
ZapBack.defaultProps = ZapProps;

export default ZapBack;
