import * as React from 'react';
import { Animated } from 'react-native';

import Mover from './Mover';
import user from 'Managers/UserManager';

import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').FlatList} FlatList
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 */

/**
 * @typedef {object} BottomPanelParamsType
 * @property {React.ReactNode} content
 * @property {boolean} [movable] Can the panel be moved by the user ? Default is true
 * @property {number} [defaultPosY] Size of the panel opening, 0 = open at least, 1 = open to the maximum, default is 0
 * @property {number} [minPosY] - ⚠️ Deprecated => Padding is behind bottomBar when its opened
 * - Minimum size of the panel in pixels, default is same as maxPosY to disable the feature
 * @property {number} [maxPosY] Maximum size of the panel in pixels, default is 90% of the screen height
 * @property {number} [zIndex] Default is 0
 * @property {React.RefObject<FlatList>} [refScroller]
 * @property {() => void} [onClose]
 */

class BottomPanelBack extends React.Component {
    state = {
        /** @type {'opened' | 'opening' | 'closed'} */
        state: 'closed',

        /** @type {BottomPanelParamsType | null} */
        current: null,

        animOpacity: new Animated.Value(0)
    };

    mover = new Mover();

    /**
     * @type {boolean} Is panel opened, to avoid multiple opening
     * @private
     */
    opening = false;

    /**
     * Open the screen list
     * @param {BottomPanelParamsType} params
     */
    Open = (params) => {
        if (this.opening || this.state.state !== 'closed') {
            return;
        }

        this.opening = true;
        this.mover.scrollEnabled = true;

        // Set default values
        this.mover.panel.height = 0;
        this.mover.panel.maxPosY = params.maxPosY ?? user.interface.size.height * 0.9;
        this.mover.panel.minPosY = params.minPosY ?? this.mover.panel.maxPosY;
        if (this.mover.panel.minPosY > this.mover.panel.maxPosY) {
            this.mover.panel.minPosY = this.mover.panel.maxPosY;
        }

        // Open animation
        user.interface.navBar?.onOpenBottomPanel();
        TimingAnimation(this.state.animOpacity, 1, 200).start();
        this.setState({ state: 'opening', current: params }, () => {
            this.opening = false;
        });

        user.interface.AddCustomBackHandler(this._close);
    };

    _close = () => {
        this.Close(true);
        return false;
    };

    /**
     * Close the screen list
     * @param {boolean} [triggerNavbarRefresh] Trigger navbar refresh
     * @returns {Promise<void>}
     */
    Close = async (triggerNavbarRefresh = false) => {
        if (this.state.state !== 'opened') {
            return;
        }

        // Close animation
        this.mover.GotoY(0);
        TimingAnimation(this.state.animOpacity, 0, 200).start();

        if (!triggerNavbarRefresh) {
            this.mover.events.isClosing = true;
        }
        user.interface.RemoveCustomBackHandler(this._close);
        this.mover.UnsetScrollView();

        // Close state to enable click through
        return new Promise((resolve) => {
            this.setState({ state: 'closed' }, () => {
                this.state.current?.onClose?.();
                user.interface.navBar?.onCloseBottomPanel();

                setTimeout(() => {
                    // Reset state (wait for the animation to finish)
                    this.setState({ current: null }, () => {
                        resolve();
                    });
                    this.mover.events.isClosing = false;
                }, 150);
            });
        });
    };

    IsOpened = () => this.state.state === 'opened' || this.state.state === 'opening';

    EnableScroll = () => (this.mover.scrollEnabled = true);

    DisableScroll = () => (this.mover.scrollEnabled = false);

    /** @param {LayoutChangeEvent} event */
    onLayoutPanel = (event) => {
        const { height } = event.nativeEvent.layout;

        if (this.state.state === 'opening') {
            this.mover.panel.height = height;

            this.setState({ state: 'opened' }, () => {
                const { current } = this.state;

                if (current?.movable === false) {
                    this.mover.scrollEnabled = false;
                }

                if (current?.refScroller?.current) {
                    this.mover.SetScrollView(current.refScroller.current);
                }

                const ratio = this.state.current?.defaultPosY ?? 0;
                const newPosY = this.mover.panel.maxPosY * ratio + this.mover.panel.minPosY;
                this.mover.GotoY(newPosY);
            });
        }
    };

    /** @param {GestureResponderEvent} event */
    onTouchEndBackground = (event) => {
        // Short click on background
        if (
            event.target === event.currentTarget &&
            Date.now() - this.mover.events.tickTime < 200 &&
            Math.abs(this.mover.events.accX) < 5 &&
            Math.abs(this.mover.events.accY) < 5
        ) {
            this.Close(true);
            return;
        }

        this.mover.touchEnd(event);
    };
}

export default BottomPanelBack;
