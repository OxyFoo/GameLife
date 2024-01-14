import * as React from 'react';
import { Animated } from 'react-native';

import { UpdatePositions } from './updatePos';
import user from 'Managers/UserManager';

import { GetAbsolutePosition } from 'Utils/UI';
import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {import('Interface/Components/Zap/back').ZapColor} ZapColor
 * @typedef {import('Interface/Components/Zap/back').ZapInclinaison} ZapInclinaison
 * @typedef {import('Interface/Components/Zap/back').ZapFace} ZapFace
 * @typedef {import('Interface/Components/Zap/back').ZapOrientation} ZapOrientation
 * 
 * @typedef {object} TutoElement
 * @property {React.Component | null} component Ref of component to display (null to hide all the screen)
 * @property {string} text Text to display
 * @property {number} [fontSize] Font size of the text
 * @property {() => void | Promise<void> | null} [execBefore=null] Function to execute before showing the element
 * @property {() => boolean | Promise<boolean> | null} [execAfter=null] Function to execute after showing the element, return true to close the tutorial
 * @property {boolean | null} [showNextButton=null] Show the button to continue (default is showed when component is null)
 * @property {boolean} [showSkipButton=true] Show or hide the skip button (default is always showed)
 * @property {number|null} [positionY=null] Y position of the message (null to center) [0,1]
 * @property {boolean} [zapInline=false] is Zap going to be displayed side to the message or not
 */

/** @type {TutoElement} */
const DEFAULT_TUTO_ELEMENT = {
    component: null,
    text: 'Empty',
    fontSize: 24,
    execBefore: null,
    execAfter: null,
    showNextButton: null,
    showSkipButton: true,
    positionY: null,
    zapInline: false
};

class ScreenTutoBack extends React.Component {
    state = {
        visible: false,
        positionY: null,
        showNextButton: true,
        showSkipButton: true,

        component: {
            /** @type {React.Component | null} */
            ref: null,
            position: { x: 0, y: 0 },
            size: { x: 0, y: 0 },
            hintOpacity: new Animated.Value(0)
        },

        zap: {
            position: new Animated.ValueXY({ x: 0, y: 0 }),
            inline: false,

            /** @type {ZapColor} */
            color: 'day',

            /** @type {ZapInclinaison} */
            inclinaison: 'onFourLegs',

            /** @type {ZapFace} */
            face: 'face',

            /** @type {ZapOrientation} */
            orientation: 'right'
        },

        message: {
            text: '',
            position: new Animated.ValueXY({ x: 0, y: 0 }),
            fontSize: 24
        }
    }

    /** @type {LayoutRectangle | null} */
    zapLayout = null;

    /** @type {LayoutRectangle | null} */
    messageLayout = null;

    componentWillUnmount() {
        clearTimeout(this.hinterval);
    }

    /** @param {LayoutChangeEvent} event */
    onZapLayout = (event) => {
        const { layout } = event.nativeEvent;
        this.zapLayout = layout;
        UpdatePositions.call(this);
    }
    /** @param {LayoutChangeEvent} event */
    onMessageLayout = (event) => {
        const { layout } = event.nativeEvent;
        this.messageLayout = layout;
        UpdatePositions.call(this);
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
        const { component, text, showNextButton, showSkipButton, fontSize, positionY, zapInline } = element;

        let position = {
            x: user.interface.screenWidth / 2,
            y: user.interface.screenHeight * 2 / 3,
            width: 0,
            height: 0
        };

        let error = false;
        let showNext = true;

        // Get component position
        if (component !== null) {
            const pos = await GetAbsolutePosition(component);
            if (!pos.width || !pos.height) {
                error = true;
            } else {
                position = pos;
                showNext = false;
            }
        }

        // Show next button manually
        if (showNextButton !== null) {
            showNext = showNextButton;
        }

        this.setState({
            visible: true,
            positionY: positionY,
            showNextButton: showNext,
            showSkipButton: showSkipButton,

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
            zap: {
                ...this.state.zap,
                inline: zapInline
            },
            message: {
                ...this.state.message,
                text: text,
                fontSize: fontSize
            }
        }, UpdatePositions.bind(this));

        // Hint opacity - Reset
        clearTimeout(this.hinterval);
        TimingAnimation(this.state.component.hintOpacity, 0, 0).start();

        // Hint opacity - Start
        let hintOpacity = 0;
        this.hinterval = window.setInterval(() => {
            hintOpacity = hintOpacity === 0 ? 1 : 0;
            TimingAnimation(this.state.component.hintOpacity, hintOpacity, 1000).start();
        }, 5000);
    }

    IsOpened = () => {
        return this.state.visible;
    }
}

export default ScreenTutoBack;
