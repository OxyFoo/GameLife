import * as React from 'react';
import { Animated, Dimensions } from 'react-native';

import { POPUP_TEMPLATES } from './templates';

import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 */

/**
 * @template {[data: any, closeReason: any]} T
 * @typedef {Object} PopupType
 * @property {(close: (closeReason: T[1]) => void) => React.JSX.Element} content
 * @property {boolean} [priority=false] If true, popup will be opened immediately
 * @property {(button: T[1] | 'closed') => void} [callback=() => {}]
 * @property {boolean} [cancelable=true]
 */

/**
 * @template {[data: any, closeReason: any]} T
 * @typedef {Object} PopupTemplateType
 * @property {keyof POPUP_TEMPLATES} type
 * @property {{ title: string, message: string }} data
 * @property {boolean} [priority=false] If true, popup will be opened immediately
 * @property {(button: T[1] | 'closed') => void} [callback=() => {}]
 * @property {boolean} [cancelable=true]
 */

/**
 * @template {[data: any, closeReason: any]} T
 * @callback PopupRenderType
 * @param {Object} props
 * @param {T[0]} props.data
 * @param {(closeReason: T[1]) => void} props.close
 * @returns {React.JSX.Element}
 */

class PopupBack extends React.PureComponent {
    opened = false;

    /** @type {PopupType<any>[]} */
    queue = [];

    state = {
        /** @type {PopupType<any>[]} */
        currents: [],

        animQuitPos: new Animated.ValueXY({ x: 0, y: 0 }),
        animOpacity: new Animated.Value(0),
        animScale: new Animated.Value(0.9)
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

    /** @param {LayoutChangeEvent} e */
    onLayout = (e) => {
        const { x, y } = e.nativeEvent.layout;
        const SCREEN_SIZE = Dimensions.get('screen');

        this.lastLayout = { x, y };
        this.state.animQuitPos.setValue({ x: -x, y: SCREEN_SIZE.height / 2 });
        SpringAnimation(this.state.animQuitPos, { x: -x, y }).start();
    };

    /**
     * @template {[data: any, closeReason: any]} T
     * @param {PopupType<T>} params
     * @returns {Promise<void>} Promise resolved when popup is opened
     */
    Open = async (params) => {
        this.queue.push({
            content: params.content,
            priority: params?.priority ?? false,
            callback: params?.callback ?? (() => {}),
            cancelable: params?.cancelable ?? true
        });
        this.proccessQueue();
    };

    /**
     * Open popup with template
     * @template {[data: any, closeReason: any]} T
     * @param {PopupTemplateType<T>} params
     * @returns {Promise<void>} Promise resolved when popup is opened
     */
    OpenT = async (params) => {
        const Popup = POPUP_TEMPLATES[params.type];
        const content = () => <Popup data={params.data} close={this.Close} />;

        this.queue.push({
            content,
            priority: params?.priority ?? false,
            callback: params?.callback ?? (() => {}),
            cancelable: params?.cancelable ?? true
        });
        this.proccessQueue();
    };

    /** @private */
    proccessQueue = () => {
        if (this.opened || this.queue.length === 0) {
            return;
        }

        const newPopup = this.queue.shift();
        if (!newPopup) {
            return;
        }

        this.opened = true;
        this.setState(
            (/** @type {this['state']} */ prevState) => ({
                currents: [...prevState.currents, newPopup]
            }),
            () => {
                // Start animations
                Animated.parallel([
                    TimingAnimation(this.state.animOpacity, 1, 200),
                    TimingAnimation(this.state.animScale, 1, 200)
                ]).start();
            }
        );
    };

    /**
     * Close popup
     * @param {any} closeReason
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
            TimingAnimation(this.state.animOpacity, 0, 200),
            TimingAnimation(this.state.animScale, 0.9, 200),
            TimingAnimation(
                this.state.animQuitPos,
                {
                    x: -this.lastLayout.x,
                    y: this.lastLayout.y + 48
                },
                200
            )
        ]).start(() => {
            this.setState(
                (/** @type {this['state']} */ prevState) => ({
                    currents: prevState.currents.slice(0, -1)
                }),
                this.proccessQueue
            );
        });

        this.opened = false;
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
        if (
            current?.cancelable &&
            Math.abs(pageX - this.clickPos.x) < 5 &&
            Math.abs(pageY - this.clickPos.y) < 5
        ) {
            this.Close('closed');
        }
    };
}

export default PopupBack;
