import * as React from 'react';
import { Animated, Dimensions } from 'react-native';

import { POPUP_TEMPLATES } from './templates';
import user from 'Managers/UserManager';

import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * @typedef {import('./templates').PopupTemplatesProps} PopupTemplatesProps
 */

/**
 * @template {any} T
 * @typedef {(params: PopupType<T>) => Promise<void>} PopupOpenType Promise resolved when popup is opened
 */

/**
 * @template {any} T
 * @typedef {Object} PopupType
 * @property {React.ReactNode} content
 * @property {boolean} [priority=false] If true, popup will be opened immediately
 * @property {(button: T | 'closed') => void} [callback=() => {}] TODO: Why T is not recognized ?
 * @property {boolean} [cancelable=true]
 */

/**
 * @template {keyof POPUP_TEMPLATES} T
 * @typedef {Object} PopupTemplateType
 * @property {T} type
 * @property {{ title: string, message: string }} data
 * @property {boolean} [priority=false] If true, popup will be opened immediately over others, else it will be queued
 * @property {(button: PopupTemplatesProps[T] | 'closed') => void} [callback=() => {}]
 * @property {boolean} [cancelable=true]
 */

/**
 * @template {any} T
 * @typedef {Object} PopupQueueType
 * @property {React.ReactNode} content
 * @property {boolean} [priority=false] If true, popup will be opened immediately
 * @property {(button: T | 'closed') => void} [callback=() => {}]
 * @property {boolean} [cancelable=true]
 * @property {(event: LayoutChangeEvent) => void} onLayout
 * @property {Animated.Value} animScale
 * @property {Animated.Value} animOpacity
 * @property {Animated.ValueXY} animQuitPos
 * @property {boolean} mounted
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
     * @template {any} T
     * @type {PopupOpenType<T>}
     */
    Open = async (params) => {
        /** @type {PopupQueueType<T>} */
        const newPopup = {
            content: params.content,
            priority: params?.priority ?? false,
            callback: params?.callback ?? (() => {}),
            cancelable: params?.cancelable ?? true,
            onLayout: (event) => this.onPopupLayout(event, newPopup),
            animOpacity: new Animated.Value(0),
            animScale: new Animated.Value(0.9),
            animQuitPos: new Animated.ValueXY({ x: 0, y: 0 }),
            mounted: false
        };

        this.queue.push(newPopup);
        this.proccessQueue();
    };

    /**
     * Open popup with template
     * @template {keyof POPUP_TEMPLATES} T
     * @param {PopupTemplateType<T>} params
     * @returns {Promise<void>} Promise resolved when popup is opened
     */
    OpenT = async (params) => {
        /** @type {POPUP_TEMPLATES[keyof POPUP_TEMPLATES]} */
        const PopupTemplate = POPUP_TEMPLATES[params.type];

        /** @type {PopupQueueType<PopupTemplatesProps[T]>} */
        const newPopup = {
            content: <PopupTemplate data={params.data} close={this.Close} />,
            priority: params?.priority ?? false,
            callback: params?.callback ?? (() => {}),
            cancelable: params?.cancelable ?? true,
            onLayout: (event) => this.onPopupLayout(event, newPopup),
            animScale: new Animated.Value(0.9),
            animOpacity: new Animated.Value(0),
            animQuitPos: new Animated.ValueXY({ x: 0, y: 0 }),
            mounted: false
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

                // Back handler
                user.interface.AddCustomBackHandler(this.CloseHandle);
            }
        );
    };

    /**
     * Close popup
     * @param {string} [closeReason]
     */
    Close = (closeReason) => {
        user.interface.BackHandle({ args: closeReason });
    };

    /**
     * Close popup
     * @param {string} [closeReason]
     * @returns {boolean | (() => void)} True if popup was closed
     */
    CloseHandle = (closeReason) => {
        const { currents } = this.state;

        // Popup is not opened
        if (!this.opened || currents.length === 0) {
            return false;
        }

        const current = currents[currents.length - 1];
        if (!current) {
            return false;
        }

        // Popup try to close with back button but it's not cancelable
        if (!current.cancelable && typeof closeReason === 'undefined') {
            return false;
        }

        // If it's last popup, close to default
        if (currents.length <= 1) {
            this.opened = false;
        }

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
                        this.proccessQueue();
                    }
                }
            );
        });

        const callback = current.callback;
        if (callback) {
            return () => callback(closeReason ?? 'closed');
        }

        return true;
    };

    /**
     * @param {LayoutChangeEvent} event
     * @param {PopupQueueType<any>} newPopup
     */
    onPopupLayout = (event, newPopup) => {
        const { x, y } = event.nativeEvent.layout;

        // If popup is already in this position do nothing
        if (this.lastLayout.x === x && this.lastLayout.y === y) {
            return;
        }

        // Update last layout
        this.lastLayout.x = x;
        this.lastLayout.y = y;

        // If popup is not mounted, set initial position
        if (!newPopup.mounted) {
            const SCREEN_SIZE = Dimensions.get('screen');

            newPopup.mounted = true;
            newPopup.animQuitPos.setValue({ x: -x, y: SCREEN_SIZE.height / 2 });
        }

        // Start animation
        SpringAnimation(newPopup.animQuitPos, { x: -x, y }).start();
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
        if (currents.length === 0 || !this.opened) {
            return;
        }

        const current = currents[currents.length - 1];
        if (current?.cancelable && Math.abs(pageX - this.clickPos.x) < 5 && Math.abs(pageY - this.clickPos.y) < 5) {
            this.Close('closed');
        }
    };
}

export default PopupBack;
