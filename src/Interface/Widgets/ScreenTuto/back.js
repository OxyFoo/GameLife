import * as React from 'react';
import { Animated, View } from 'react-native';

import user from 'Managers/UserManager';

import { GetDate } from 'Utils/Time';
import { SpringAnimation } from 'Utils/Animations';
import { GetAbsolutePosition } from './utils';
import { Sleep } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {Object} TutoBuilderProps
 * @property {React.Component|null} component Component to display (null to hide all the screen)
 * @property {string} text Text to display
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

const ScreenTutoProps = {
}

class ScreenTutoBack extends React.Component {
    state = {
        visible: false,
        opacity: new Animated.Value(0),

        button: null,
        buttonText: '',

        component: {
            /** @type {React.Component|null} */
            ref: null,
            position: { x: 0, y: 0 },
            size: { x: 0, y: 0 }
        },

        message: {
            text: '',
            position: { x: 0, y: 0 },
            /** @type {LayoutRectangle} */
            layout: { x: 0, y: 0, width: 0, height: 0 }
        },

        zap: {
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
    }

    __callback = null;

    onZapLayout = (event) => {
        const { zap } = this.state;
        const { layout } = event.nativeEvent;
        this.setState({ zap: { ...zap, layout } });
    }

    onMessageLayout = (event) => {
        const { message } = this.state;
        const { layout } = event.nativeEvent;
        this.setState({ message: { ...message, layout } });
    }

    /**
     * @param {View} ref
     * @param {string} text
     */
    Show = async (ref, text, callback) => {
        await Sleep(500);
        const position = await GetAbsolutePosition(ref);

        const { zap, message } = this.state;

        const btnMidX = position.x + position.width / 2;
        const btnMidY = position.y + position.height / 2;

        const theta = Math.atan2(
            btnMidX - user.interface.screenWidth / 2,
            btnMidY - user.interface.screenHeight / 2
        ) + Math.PI / 2;

        const offset = 75;
        const offsetX = + Math.cos(theta) * offset;
        const offsetY = - Math.sin(theta) * (offset + position.height / 2);

        // Get quarter of the screen
        const quartersZapY = [ 2.5, -1, -1, 2.5 ];
        const quarterIndex = Math.floor(btnMidY / (user.interface.screenHeight / 4));

        const isTop = quarterIndex === 0 || quarterIndex === 2;
        const isLeft = position.x < user.interface.screenWidth / 2;

        // Zap position
        const isNight = GetDate().getHours() >= 20 || GetDate().getHours() <= 8;
        SpringAnimation(zap.position, {
            x: btnMidX + offsetX,// * quartersZapY[quarterIndex],
            y: btnMidY + offsetY * quartersZapY[quarterIndex]
        }, false).start(() => {
            this.setState({
                zap: {
                    ...this.state.zap,
                    face: 'show'
                }
            });
        });

        // Message position
        const messageX = btnMidX + offsetX;// * quartersTextY[quarterIndex];
        const messageY = btnMidY + offsetY * 1;

        this.setState({
            visible: true,
            component: {
                ...this.state.component,
                ref: ref,
                position: {
                    x: position.x,
                    y: position.y
                },
                size: {
                    x: position.width,
                    y: position.height
                }
            },
            message: {
                ...this.state.message,
                position: {
                    x: messageX,
                    y: messageY
                },
                text: text
            },
            zap: {
                ...this.state.zap,

                /** @type {ZapColor} */
                color: isNight ? 'night' : 'day',
                /** @type {ZapInclinaison} */
                inclinaison: isTop ? 'onTwoLegs' : 'onFourLegs',
                /** @type {ZapFace} */
                face: 'face',
                /** @type {ZapOrientation} */
                orientation: isLeft ? 'right' : 'left'
            }
        });

        this.__callback = callback;
    }

    End = () => {
        this.setState({
            visible: false
        });
        if (this.__callback) this.__callback();
    }

    getZapImage = () => {
        const { zap: { color, inclinaison, face } } = this.state;
        return ZAP_IMAGES[color][inclinaison][face];
    }
}

ScreenTutoBack.prototype.props = ScreenTutoProps;
ScreenTutoBack.defaultProps = ScreenTutoProps;

export default ScreenTutoBack;