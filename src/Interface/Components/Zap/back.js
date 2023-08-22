import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';

import { GetDate } from 'Utils/Time';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * 
 * @typedef {'day'|'night'} ZapColor
 * @typedef {'onTwoLegs'|'onFourLegs'} ZapInclinaison
 * @typedef {'face'|'show'} ZapFace
 * @typedef {'left'|'right'} ZapOrientation
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
    /** @type {LayoutRectangle} */
    componentLayout: { x: 0, y: 0, width: 0, height: 0 },
}

class ZapBack extends React.Component {
    state = {
        position: new Animated.ValueXY({ x: 0, y: 0 }),

        /** @type {LayoutRectangle} */
        layout: { x: 0, y: 0, width: 0, height: 0 },

        /** @type {ZapColor} */
        color: 'day',
        /** @type {ZapInclinaison} */
        inclinaison: 'onTwoLegs',
        /** @type {ZapFace} */
        face: 'face',
        /** @type {ZapOrientation} */
        orientation: 'right'
    }

    /**
     * @param {LayoutRectangle} layoutTarget
     * @param {LayoutRectangle} layoutMessage
     */
    UpdateTarget = (layoutTarget, layoutMessage) => {
        const { layout } = this.state;

        const btnMidX = layoutTarget.x + layoutTarget.width / 2;
        const btnMidY = layoutTarget.y + layoutTarget.height / 2;

        const theta = Math.atan2(
            btnMidX - user.interface.screenWidth / 2,
            btnMidY - user.interface.screenHeight / 2
        ) + Math.PI / 2;

        // Get quarter of the screen
        const quarterIndex = Math.floor(btnMidY / (user.interface.screenHeight / 4));

        const isTop = quarterIndex === 0 || quarterIndex === 2;
        const isLeft = layoutTarget.x < user.interface.screenWidth / 2;
        const isNight = GetDate().getHours() >= 20 || GetDate().getHours() <= 8;

        let offset = layoutTarget.height / 2 + layout.height / 2 + 24;
        if (quarterIndex === 0 || quarterIndex === 3) {
            offset = - offset - layoutMessage.height - 24;
        }
        const offsetX = Math.cos(theta) * offset;
        const offsetY = Math.sin(theta) * offset;

        // Zap position
        SpringAnimation(this.state.position, {
            x: btnMidX + offsetX,
            y: btnMidY + offsetY
        }).start(() => {
            this.setState({ face: 'show' });
        });

        this.setState({
            /** @type {ZapColor} */
            color: isNight ? 'night' : 'day',
            /** @type {ZapInclinaison} */
            inclinaison: isTop ? 'onTwoLegs' : 'onFourLegs',
            /** @type {ZapFace} */
            face: 'face',
            /** @type {ZapOrientation} */
            orientation: isLeft ? 'right' : 'left'
        });
    }

    onZapLayout = (event) => {
        const { layout } = event.nativeEvent;
        if (this.state.layout.width !== layout.width ||
            this.state.layout.height !== layout.height) {
            this.setState({ layout });
        }
    }

    getZapImage = () => {
        const { color, inclinaison, face } = this.state;
        return ZAP_IMAGES[color][inclinaison][face];
    }
}

ZapBack.prototype.props = ZapProps;
ZapBack.defaultProps = ZapProps;

export default ZapBack;