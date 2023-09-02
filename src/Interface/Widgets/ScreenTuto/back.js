import * as React from 'react';
import { Animated, View } from 'react-native';

import user from 'Managers/UserManager';

import { Sleep } from 'Utils/Functions';
import { GetAbsolutePosition } from 'Utils/UI';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Interface/Components/Zap').default} Zap
 * 
 * @typedef {object} TutoElement
 * @property {React.Component|null} component Component to display (null to hide all the screen)
 * @property {string} text Text to display
 * @property {boolean} [showButton=true] Show the button to continue
 */

const ScreenTutoProps = {
}

class ScreenTutoBack extends React.Component {
    state = {
        visible: false,
        showButton: false,

        component: {
            /** @type {React.Component|null} */
            ref: null,
            position: { x: 0, y: 0 },
            size: { x: 0, y: 0 }
        },

        message: {
            text: '',
            position: new Animated.ValueXY({ x: 0, y: 0 }),
            isOnTop: false,
            hintOpacity: new Animated.Value(0)
        }
    }

    /** @type {Zap} */
    refZap = null;

    lastMessageLayout = { x: 0, y: 0, width: 0, height: 0 };

    componentWillUnmount() {
        clearTimeout(this.hinterval);
    }

    onMessageLayout = (event) => {
        const { layout } = event.nativeEvent;
        this.lastMessageLayout = layout;
        this.UpdatePositions(layout);
    }

    onComponentPress = (value) => {}

    /**
     * @param {TutoElement[]} sequence
     * @param {() => void|null} callback
     * @returns {Promise<void>}
     */
    ShowSequence = async (sequence, callback) => {
        for (let i = 0; i < sequence.length; i++) {
            const { component, text, showButton } = sequence[i];

            await new Promise(resolve => {
                this.onComponentPress = resolve;
                this.Show(component, text, showButton, null);
            });
        }
        this.End(callback);
    }

    /**
     * @param {React.Component|null} ref
     * @param {string} text
     * @param {boolean} showButton
     * @param {() => void|null} callback
     */
    Show = async (ref, text, showButton = true, callback = null) => {
        let position = { x: user.interface.screenWidth / 2, y: user.interface.screenHeight / 2, width: 0, height: 0 };

        if (ref !== null) {
            position = await GetAbsolutePosition(ref);
            while (position.width === 0 || position.height === 0) {
                position = await GetAbsolutePosition(ref);
                await Sleep(100);
            }
        }

        const btnMidY = position.y + position.height / 2;
        const isOnTop = btnMidY < user.interface.screenHeight / 2;

        this.setState({
            visible: true,
            showButton: showButton,
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
                text: text,
                isOnTop: isOnTop
            }
        });

        this.UpdatePositions();

        // Hint opacity - Reset
        const { message } = this.state;
        clearTimeout(this.hinterval);
        TimingAnimation(message.hintOpacity, 0, 0).start();

        // Hint opacity - Start
        let hintOpacity = 0;
        this.hinterval = setInterval(() => {
            hintOpacity = hintOpacity === 0 ? 1 : 0;
            TimingAnimation(message.hintOpacity, hintOpacity, 1000).start();
        }, 5000);

        if (callback !== null) {
            this.onComponentPress = this.End.bind(this, callback);
        }
    }

    UpdatePositions = async (layout = this.lastMessageLayout) => {
        const { component: { ref } } = this.state;

        let position = {
            x: user.interface.screenWidth / 2,
            y: user.interface.screenHeight / 2,
            width: 0,
            height: 0
        };

        if (ref !== null) {
            position = await GetAbsolutePosition(ref);
        }

        const btnMidX = position.x + position.width / 2;
        const btnMidY = position.y + position.height / 2;
        const isOnTop = btnMidY < user.interface.screenHeight / 2;

        const theta = Math.atan2(
            btnMidX - user.interface.screenWidth / 2,
            btnMidY - user.interface.screenHeight / 2
        ) + Math.PI / 2;

        const offset = position.height / 2;
        const offsetX = + Math.cos(theta) * offset;
        const offsetY = - Math.sin(theta) * offset;

        // Message position (with delay)
        let messageX = btnMidX + offsetX - layout.width / 2;
        let messageY = btnMidY + offsetY + (isOnTop ? 24 : - layout.height - 24);

        // Message position verification
        if (messageX < 0)
            messageX = 0;
        if (messageX + layout.width > user.interface.screenWidth)
            messageX = user.interface.screenWidth - layout.width;
        if (messageY < 0)
            messageY = 0;
        if (messageY + layout.height > user.interface.screenHeight)
            messageY = user.interface.screenHeight - layout.height;

        setTimeout(() => {
            SpringAnimation(this.state.message.position, {
                x: messageX,
                y: messageY
            }).start();
        }, 100);

        // Zap position
        this.refZap?.UpdateTarget(position, layout);
    }

    End = (callback) => {
        clearTimeout(this.hinterval);
        this.setState({ visible: false });
        if (callback) {
            callback();
        }
    }
}

ScreenTutoBack.prototype.props = ScreenTutoProps;
ScreenTutoBack.defaultProps = ScreenTutoProps;

export default ScreenTutoBack;