import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';

import { Sleep } from 'Utils/Functions';
import { GetAbsolutePosition } from 'Utils/UI';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Interface/Components/Zap').default} Zap
 * 
 * @typedef {object} TutoElement
 * @property {React.Component | null} component Ref of component to display (null to hide all the screen)
 * @property {string} text Text to display
 * @property {() => void | Promise<void> | null} [execBefore=null] Function to execute before showing the element
 * @property {() => boolean | Promise<boolean> | null} [execAfter=null] Function to execute after showing the element, return true to close the tutorial
 * @property {boolean} [showButton=true] Show the button to continue
 * @property {boolean} [showSkip=true] Show the button to skip
 */

const DEFAULT_TUTO_ELEMENT = {
    component: null,
    text: 'Empty',
    execBefore: null,
    execAfter: null,
    showButton: true,
    showSkip: true
};

class ScreenTutoBack extends React.Component {
    state = {
        visible: false,
        showButton: false,

        component: {
            /** @type {React.Component | null} */
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
    onSkipPress = () => {}

    setStateSync = (state) => new Promise(resolve => this.setState(state, () => resolve()));

    /**
     * @param {TutoElement[]} sequence
     * @returns {Promise<void>}
     */
    ShowTutorial = async (sequence) => {
        for (let i = 0; i < sequence.length; i++) {
            /** @type {TutoElement} */
            const element = { ...DEFAULT_TUTO_ELEMENT, ...sequence[i] };
            const { execBefore, execAfter } = element;

            // Before
            if (execBefore !== null) {
                await this.setStateSync({
                    component: { ...this.state.component, ref: null }
                });
                await execBefore();
            }

            // Show the tutorial element
            let skip = false;
            await new Promise(resolve => {
                this.onComponentPress = resolve;
                this.onSkipPress = () => { skip = true; resolve(); };
                this.Show(element);
            });

            // Autorize skip during execAfter (if crashed)
            this.onSkipPress = () => {
                skip = true;
                this.setState({ visible: false });
            }

            // After
            const newState = {
                component: { ...this.state.component, ref: null }
            };

            if (skip) {
                clearTimeout(this.hinterval);
                newState['visible'] = false;
            }
            else if (execAfter !== null) {
                // Close the tutorial (& execute execAfter)
                const close = await execAfter();
                if (close) {
                    clearTimeout(this.hinterval);
                    newState['visible'] = false;
                }
            }
            else if (i === sequence.length - 1) {
                clearTimeout(this.hinterval);
                newState['visible'] = false;
            }

            await this.setStateSync(newState);
            if (skip) break;
        }
    }

    /**
     * @private
     * @param {TutoElement} element
     * @returns {Promise<void>}
     */
    Show = async (element) => {
        let position = { x: user.interface.screenWidth / 2, y: user.interface.screenHeight * 2 / 3, width: 0, height: 0 };

        const { component, text, showButton, showSkip } = element;

        let error = false;
        if (component !== null) {
            const pos = await GetAbsolutePosition(component);
            if (!pos.width || !pos.height) {
                error = true;
            } else {
                position = pos;
            }
        }

        const btnMidY = position.y + position.height / 2;
        const isOnTop = btnMidY < user.interface.screenHeight / 2;

        this.setState({
            visible: true,
            showButton: showButton,
            component: {
                ...this.state.component,
                ref: error ? null : component,
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
            },
            showSkip: showSkip
        });

        this.UpdatePositions();

        // Hint opacity - Reset
        const { message } = this.state;
        clearTimeout(this.hinterval);
        TimingAnimation(message.hintOpacity, 0, 0).start();

        // Hint opacity - Start
        let hintOpacity = 0;
        this.hinterval = window.setInterval(() => {
            hintOpacity = hintOpacity === 0 ? 1 : 0;
            TimingAnimation(message.hintOpacity, hintOpacity, 1000).start();
        }, 5000);
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

    IsOpened = () => {
        return this.state.visible;
    }
}

export default ScreenTutoBack;
