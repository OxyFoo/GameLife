import * as React from 'react';
import { Animated, Dimensions } from 'react-native';

import { POPUP_TEMPLATES } from './templates';

import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 */

/**
 * @typedef {{ data: any, closeReason: any }} PopupTemplateJSDoc
 */

/**
 * @template {PopupTemplateJSDoc} T
 * @typedef {Object} PopupType
 * @property {React.ComponentType<T>} content
 * @property {boolean} [priority=false] If true, popup will be opened immediately
 * @property {(button: T['closeReason'] | 'closed') => void} [callback=() => {}]
 * @property {boolean} [cancelable=true]
 */

/**
 * @template {PopupTemplateJSDoc} T
 * @typedef {Object} PopupQueueType
 * @property {React.ComponentType<T['data']>} content
 * @property {T['data']} [data]
 * @property {boolean} [priority=false] If true, popup will be opened immediately
 * @property {(button: T['closeReason'] | 'closed') => void} [callback=() => {}]
 * @property {boolean} [cancelable=true]
 * @property {(event: LayoutChangeEvent) => void} onLayout
 * @property {Animated.Value} animScale
 * @property {Animated.Value} animOpacity
 * @property {Animated.ValueXY} animQuitPos
 */

/**
 * @template {PopupTemplateJSDoc} T
 * @typedef {Object} PopupTemplateType
 * @property {keyof POPUP_TEMPLATES} type
 * @property {{ title: string, message: string }} data
 * @property {boolean} [priority=false] If true, popup will be opened immediately over others, else it will be queued
 * @property {(button: T['closeReason'] | 'closed') => void} [callback=() => {}]
 * @property {boolean} [cancelable=true]
 */

/**
 * @template {PopupTemplateJSDoc} T
 * @callback PopupRenderType
 * @param {Object} props
 * @param {T['data']} props.data
 * @param {(closeReason: T[1]) => void} props.close
 * @returns {React.JSX.Element}
 */

class PopupBack extends React.PureComponent {
    opened = false;

    /** @type {PopupQueueType<any>[]} */
    queue = [];

    state = {
        /** @type {PopupQueueType<any>[]} */
        currents: []
    };

    /**
     * @private Temporary variable
     * @type {{ x: number, y: number }}
     */
    clickPos = { x: 0, y: 0 };

    /**
     * @private Temporary variable
     * @type {{ x: number, y: number }}
     */
    lastLayout = { x: 0, y: 0 };

    /**
     * @template {PopupTemplateJSDoc} T
     * @param {PopupType<T>} params
     * @returns {Promise<void>} Promise resolved when popup is opened
     */
    Open = async (params) => {
        /** @type {PopupQueueType<any>} */
        const newPopup = {
            content: params.content,
            priority: params?.priority ?? false,
            callback: params?.callback ?? (() => {}),
            cancelable: params?.cancelable ?? true,
            onLayout: (event) => {
                const { x, y } = event.nativeEvent.layout;
                const SCREEN_SIZE = Dimensions.get('screen');

                this.lastLayout = { x, y };
                newPopup.animQuitPos.setValue({ x: -x, y: SCREEN_SIZE.height / 2 });
                SpringAnimation(newPopup.animQuitPos, { x: -x, y }).start();
            },
            animOpacity: new Animated.Value(0),
            animScale: new Animated.Value(0.9),
            animQuitPos: new Animated.ValueXY({ x: 0, y: 0 })
        };

        this.queue.push(newPopup);
        this.proccessQueue();
    };

    /**
     * Open popup with template
     * @template {PopupTemplateJSDoc} T
     * @param {PopupTemplateType<T>} params
     * @returns {Promise<void>} Promise resolved when popup is opened
     */
    OpenT = async (params) => {
        /** @type {PopupQueueType<any>} */
        const newPopup = {
            content: POPUP_TEMPLATES[params.type],
            data: params.data,
            priority: params?.priority ?? false,
            callback: params?.callback ?? (() => {}),
            cancelable: params?.cancelable ?? true,
            onLayout: (event) => {
                const { x, y } = event.nativeEvent.layout;
                const SCREEN_SIZE = Dimensions.get('screen');

                this.lastLayout = { x, y };
                newPopup.animQuitPos.setValue({ x: -x, y: SCREEN_SIZE.height / 2 });
                SpringAnimation(newPopup.animQuitPos, { x: -x, y }).start();
            },
            animScale: new Animated.Value(0.9),
            animOpacity: new Animated.Value(0),
            animQuitPos: new Animated.ValueXY({ x: 0, y: 0 })
        };

        this.queue.push(newPopup);
        this.proccessQueue();
    };

    /** @private */
    proccessQueue = () => {
        if (this.queue.length === 0) {
            return;
        }

        /** @type {PopupQueueType<any> | null} */
        let newPopup = null;

        if (this.queue.some((popup) => popup.priority)) {
            newPopup = this.queue.find((popup) => popup.priority) || null;
            if (newPopup !== null) {
                this.queue = this.queue.filter((popup) => popup !== newPopup);
            }
        } else if (!this.opened) {
            newPopup = this.queue.shift() || null;
        }

        if (newPopup === null) {
            return;
        }

        this.opened = true;
        this.setState(
            (/** @type {this['state']} */ prevState) => ({
                currents: [...prevState.currents, newPopup]
            }),
            () => {
                if (newPopup === null) {
                    return;
                }

                // Start animations
                Animated.parallel([
                    TimingAnimation(newPopup.animScale, 1, 200),
                    TimingAnimation(newPopup.animOpacity, 1, 200)
                ]).start();
            }
        );
    };

    /**
     * Close popup
     * @param {any} [closeReason]
     * @returns {boolean} True if popup was closed
     */
    Close = (closeReason) => {
        const { currents } = this.state;

        if (!this.opened || currents.length === 0) {
            return false;
        }

        const current = currents[currents.length - 1];
        if (!current) {
            return false;
        }

        current.callback && current.callback(closeReason);

        // Start end animations
        Animated.parallel([
            TimingAnimation(current.animOpacity, 0, 200),
            TimingAnimation(current.animScale, 0.9, 200),
            TimingAnimation(
                current.animQuitPos,
                {
                    x: -this.lastLayout.x,
                    y: this.lastLayout.y + 48
                },
                200
            )
        ]).start(() => {
            this.setState(
                (/** @type {this['state']} */ prevState) => ({
                    currents: prevState.currents.filter((popup) => popup !== current)
                }),
                () => {
                    if (this.state.currents.length === 0) {
                        this.opened = false;
                        this.proccessQueue();
                    }
                }
            );
        });

        return true;
    };

    /** @param {GestureResponderEvent} e */
    onBackgroundTouchStart = (e) => {
        const { pageX, pageY } = e.nativeEvent;
        this.clickPos = { x: pageX, y: pageY };
    };

    /** @param {GestureResponderEvent} e */
    onBackgroundTouchEnd = (e) => {
        const { currents } = this.state;
        const { pageX, pageY } = e.nativeEvent;

        // If popup is not opened
        if (currents.length === 0) {
            return;
        }

        const current = currents[currents.length - 1];
        if (current?.cancelable && Math.abs(pageX - this.clickPos.x) < 5 && Math.abs(pageY - this.clickPos.y) < 5) {
            this.Close('closed');
        }
    };
}

export default PopupBack;
