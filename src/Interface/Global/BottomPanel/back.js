import * as React from 'react';
import { Animated, Dimensions } from 'react-native';

import Mover from './Mover';
import user from 'Managers/UserManager';

import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').FlatList} FlatList
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * @typedef {import('react-native-safe-area-context').EdgeInsets} EdgeInsets
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
 * @property {React.RefObject<FlatList | null>} [refScroller]
 * @property {() => void} [onClose]
 * @property {boolean} [overlay] If true, panel is displayed as an overlay without blocking interactions with the page behind (no background, no close on background click). Default is false
 * @property {string} [backgroundColor] Background color of the panel. Default is 'ground1' theme color
 * @property {string} [overlayColor] Color of the overlay background. Default is black with 0.8 opacity
 * @property {boolean} [priority] If true, panel will be stacked on top of existing panels instead of replacing them
 */

/**
 * @typedef {object} BottomPanelStackItem
 * @property {BottomPanelParamsType} params
 * @property {Mover} mover
 * @property {Animated.Value} animOpacity
 * @property {'opened' | 'opening' | 'closing' | 'closed'} state
 * @property {number} height
 * @property {() => boolean} backHandler - Unique back handler for this panel
 */

class BottomPanelBack extends React.Component {
    state = {
        /** @type {BottomPanelStackItem[]} */
        stack: []
    };

    /** @deprecated Use stack[0].mover instead for base panel */
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
        const { stack } = this.state;
        const isPriority = params.priority === true;

        // If priority panel, stack it on top without closing existing ones
        if (isPriority && stack.length > 0) {
            this._openStackedPanel(params);
            return;
        }

        // Regular panel opening (replaces existing)
        if (this.opening || stack.length > 0) {
            return;
        }

        this._openPanel(params, false);
    };

    /**
     * Open a panel (base or stacked)
     * @private
     * @param {BottomPanelParamsType} params
     * @param {boolean} isStacked
     */
    _openPanel = (params, isStacked) => {
        const screenSize = Dimensions.get('window');

        this.opening = true;

        const newMover = isStacked ? new Mover() : this.mover;
        newMover.scrollEnabled = true;

        // Set default values
        newMover.panel.height = 0;
        newMover.panel.maxPosY = params.maxPosY ?? screenSize.height * 0.9;
        newMover.panel.minPosY = params.minPosY ?? newMover.panel.maxPosY;
        if (newMover.panel.minPosY > newMover.panel.maxPosY) {
            newMover.panel.minPosY = newMover.panel.maxPosY;
        }

        // Create a unique back handler for this specific panel
        const panelBackHandler = () => {
            this.Close(true);
            return false;
        };

        /** @type {BottomPanelStackItem} */
        const stackItem = {
            params,
            mover: newMover,
            animOpacity: new Animated.Value(0),
            state: 'opening',
            height: 0,
            backHandler: panelBackHandler
        };

        // Open animation
        if (!isStacked) {
            user.interface.navBar?.onOpenBottomPanel();
        }
        TimingAnimation(stackItem.animOpacity, 1, 200).start();

        this.setState(
            (/** @type {typeof this.state} */ prevState) => ({
                stack: [...prevState.stack, stackItem]
            }),
            () => {
                this.opening = false;
            }
        );

        user.interface.AddCustomBackHandler(panelBackHandler);
    };

    /**
     * Open a stacked panel on top of existing ones
     * @private
     * @param {BottomPanelParamsType} params
     */
    _openStackedPanel = (params) => {
        this._openPanel(params, true);
    };

    _close = () => {
        this.Close(true);
        return false;
    };

    /**
     * Close the topmost panel
     * @param {boolean} [triggerNavbarRefresh] Trigger navbar refresh
     * @returns {Promise<void>}
     */
    Close = async (triggerNavbarRefresh = false) => {
        const { stack } = this.state;
        if (stack.length === 0) {
            return;
        }

        const currentIndex = stack.length - 1;
        const currentItem = stack[currentIndex];

        // Prevent double close
        if (currentItem.state !== 'opened') {
            return;
        }

        // Mark as closing to prevent further interactions
        const newStack = [...stack];
        newStack[currentIndex] = { ...currentItem, state: 'closing' };
        this.setState({ stack: newStack });

        // Close animation
        currentItem.mover.GotoY(0);

        if (!triggerNavbarRefresh) {
            currentItem.mover.events.isClosing = true;
        }

        // Remove the unique back handler for this specific panel
        user.interface.RemoveCustomBackHandler(currentItem.backHandler);

        // Wait for animation to complete before removing from stack
        return new Promise((resolve) => {
            TimingAnimation(currentItem.animOpacity, 0, 200).start(() => {
                currentItem.mover.UnsetScrollView();
                currentItem.mover.events.isClosing = false;

                this.setState(
                    (/** @type {typeof this.state} */ prevState) => ({
                        stack: prevState.stack.filter((_, i) => i !== currentIndex)
                    }),
                    () => {
                        currentItem.params?.onClose?.();

                        // Only trigger navbar refresh if this was the last panel
                        if (this.state.stack.length === 0) {
                            user.interface.navBar?.onCloseBottomPanel();
                        }

                        resolve();
                    }
                );
            });
        });
    };

    /**
     * Close all panels
     * @returns {Promise<void>}
     */
    CloseAll = async () => {
        while (this.state.stack.length > 0) {
            await this.Close(true);
        }
    };

    IsOpened = () =>
        this.state.stack.length > 0 &&
        this.state.stack.some(
            (item) => item.state === 'opened' || item.state === 'opening' || item.state === 'closing'
        );

    EnableScroll = () => {
        const { stack } = this.state;
        if (stack.length > 0) {
            stack[stack.length - 1].mover.scrollEnabled = true;
        }
    };

    DisableScroll = () => {
        const { stack } = this.state;
        if (stack.length > 0) {
            stack[stack.length - 1].mover.scrollEnabled = false;
        }
    };

    /**
     * @param {LayoutChangeEvent} event
     * @param {number} stackIndex
     */
    onLayoutPanel = (event, stackIndex) => {
        const { height } = event.nativeEvent.layout;
        const { stack } = this.state;

        if (stackIndex >= stack.length) return;

        const stackItem = stack[stackIndex];

        if (stackItem.state === 'opening') {
            stackItem.mover.panel.height = height;
            stackItem.height = height;

            const newStack = [...stack];
            newStack[stackIndex] = { ...stackItem, state: 'opened' };

            this.setState({ stack: newStack }, () => {
                const { params } = stackItem;

                if (params?.movable === false) {
                    stackItem.mover.scrollEnabled = false;
                }

                if (params?.refScroller?.current) {
                    stackItem.mover.SetScrollView(params.refScroller.current);
                }

                const ratio = params?.defaultPosY ?? 0;
                const newPosY = stackItem.mover.panel.maxPosY * ratio + stackItem.mover.panel.minPosY;
                stackItem.mover.GotoY(newPosY);
            });
        }
    };

    /**
     * @param {GestureResponderEvent} event
     * @param {number} stackIndex
     */
    onTouchEndBackground = (event, stackIndex) => {
        const { stack } = this.state;
        if (stackIndex >= stack.length) return;

        const stackItem = stack[stackIndex];

        // Skip background close if overlay mode
        if (stackItem.params?.overlay) {
            return;
        }

        // Short click on background
        if (
            event.target === event.currentTarget &&
            Date.now() - stackItem.mover.events.tickTime < 200 &&
            Math.abs(stackItem.mover.events.accX) < 5 &&
            Math.abs(stackItem.mover.events.accY) < 5
        ) {
            this.Close(true);
            return;
        }

        stackItem.mover.touchEnd(event);
    };
}

export default BottomPanelBack;
