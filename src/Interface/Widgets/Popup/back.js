import * as React from 'react';
import { Animated } from 'react-native';

import { Sleep } from 'Utils/Functions';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {object} ContentArgs
 * @property {[string, string]} ok
 * @property {[string, string]} yesno
 * @property {[string, string]} acceptornot
 * @property {() => void} custom
 * 
 * @typedef {object} PopupTypes
 * @property {'ok'} ok
 * @property {'yes' | 'no'} yesno
 * @property {'accept' | 'refuse'} acceptornot
 * @property {null} custom
 */

class PopupBack extends React.PureComponent {
    opened = false;

    state = {
        type: null,
        args: null,
        callback: (type) => {},
        cancelable: true,
        cross: true,

        animQuitPos: new Animated.ValueXY({ x: 0, y: 0 }),
        animOpacity: new Animated.Value(0),
        animScale: new Animated.Value(.9)
    }

    /** @param {LayoutChangeEvent} e */
    onLayout = (e) => {
        const { x, y, } = e.nativeEvent.layout;
        SpringAnimation(this.state.animQuitPos, { x, y }).start();
    }

    /**
     * Open popup after close current one
     */
    ForceOpen = async (type, args, callback, cancelable, cross) => {
        if (this.opened) {
            this.Close();
            await Sleep(250);
        }
        this.Open(type, args, callback, cancelable, cross);
    }

    /**
     * @template {keyof PopupTypes} T
     * @param {T} type
     * @param {ContentArgs[T]} args [title, message]
     * @param {(button: PopupTypes[T]) => void} callback Callback when popup button is pressed
     * @param {boolean} cancelable if true, popup can be closed by clicking outside
     * @param {boolean} cross if true, popup can be closed by clicking on X
     * @returns {Promise<void>} Promise resolved when popup is opened
     */
    async Open(type, args, callback = () => {}, cancelable = true, cross = cancelable) {
        while (this.opened) await Sleep(200);
        this.opened = true;

        this.setState({
            type: type,
            args: args,
            callback: callback,
            cancelable: cancelable,
            cross: cross
        });

        TimingAnimation(this.state.animOpacity, 1, 200).start();
        TimingAnimation(this.state.animScale, 1, 200).start();
    }

    /**
     * Close popup
     * @param {boolean} forceClose
     * @returns {boolean} True if popup was closed
     */
    Close = (forceClose = true) => {
        const { cancelable } = this.state;
        if (!this.opened) return false;
        if (!cancelable && !forceClose) return false;

        TimingAnimation(this.state.animOpacity, 0, 200).start();
        TimingAnimation(this.state.animScale, .9, 200).start();

        this.setState({
            type: null,
            cancelable: true,
            callback: () => {}
        });

        this.opened = false;
        return true;
    }
}

export default PopupBack;
