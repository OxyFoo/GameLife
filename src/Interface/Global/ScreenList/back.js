import * as React from 'react';
import { Animated, Dimensions } from 'react-native';

import user from 'Managers/UserManager';

import { Sleep } from 'Utils/Functions';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').FlatList} FlatList
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {object} ScreenListItem
 * @property {number} id
 * @property {string} value
 */

class ScreenListBack extends React.Component {
    state = {
        opened: false,
        positionY: new Animated.Value(0),
        positionFlatlistY: new Animated.Value(0),

        label: '',
        /** @type {Array<ScreenListItem>} */
        data: [],
        anim: new Animated.Value(0)
    };

    /** @type {React.RefObject<FlatList>} */
    refFlatlist = React.createRef();

    posY = 0;
    accY = 0;
    lastY = 0;
    tickTime = 0;
    isClosing = false;
    isPressed = false;

    // Background press
    firstX = 0;
    firstY = 0;
    hasMoved = false;

    heightScreen = Dimensions.get('window').height;
    heightPanel = 0;
    heightFlatlist = 0;
    heightFlatlistContent = 0;

    /** @type {(id: number) => void} */
    callback = () => {};

    /** @type {string | null} */
    flatlistListener = null;

    componentDidMount() {
        this.flatlistListener = this.state.positionFlatlistY.addListener(({ value }) => {
            this.refFlatlist.current?.scrollToOffset({ offset: value, animated: false });
        });
    }

    componentWillUnmount() {
        if (this.flatlistListener !== null) {
            this.state.positionY.removeListener(this.flatlistListener);
        }
    }

    /**
     * Open the screen list
     * @param {string} label
     * @param {Array<ScreenListItem>} data
     * @param {(id: number) => void} callback
     */
    Open = (label = 'Input', data = [], callback = () => {}) => {
        TimingAnimation(this.state.anim, 1, 200).start();
        this.setState(
            {
                opened: true,
                label: label,
                data: data
            },
            async () => {
                // TODO: Wait real layout
                await Sleep(200); // Wait layout
                this.posY = Math.max(-this.heightPanel, -400);
                SpringAnimation(this.state.positionY, this.posY).start();
                this.callback = callback;
                user.interface.AddCustomBackHandler(this.closeHandler);
            }
        );
    };

    /**
     * Close the screen list
     * @returns {boolean} True if closed
     */
    Close = () => {
        user.interface.BackHandle();
        return true;
    };

    closeHandler = () => {
        if (!this.state.opened) {
            return false;
        }

        this.isClosing = true;
        this.posY = 0;
        this.accY = 0;
        this.callback = () => {};

        TimingAnimation(this.state.anim, 0, 200).start();
        Animated.parallel([
            SpringAnimation(this.state.positionY, this.posY),
            SpringAnimation(this.state.positionFlatlistY, this.posY)
        ]).start();

        setTimeout(() => {
            this.setState({ opened: false }, () => {
                this.isClosing = false;
            });
        }, 150);
        return true;
    };

    /** @param {number} id */
    onPressItem = (id) => {
        this.callback(id);
        this.isClosing = true;
        this.Close();
    };

    /** @param {LayoutChangeEvent} event */
    onLayoutPanel = (event) => {
        const { height } = event.nativeEvent.layout;
        this.heightPanel = height;
    };

    /** @param {LayoutChangeEvent} event */
    onLayoutFlatList = (event) => {
        const { height } = event.nativeEvent.layout;
        this.heightFlatlist = height;
    };

    /**
     * @param {number} _width
     * @param {number} height
     */
    onContentSizeChange = (_width, height) => {
        this.heightFlatlistContent = height;
    };

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        if (this.isPressed) return;

        const { pageY } = event.nativeEvent;
        this.lastY = pageY;
        this.accY = 0;

        this.isPressed = true;
        this.tickTime = Date.now();
        user.interface.console?.AddLog('info', 'ScreenList onTouchStart');
    };

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        // Position
        const { pageY } = event.nativeEvent;
        const { heightFlatlistContent, heightPanel, heightFlatlist } = this;
        const deltaY = this.lastY - pageY;
        const maxScreenY = this.heightScreen * 0.8;

        // Acceleration
        const deltaTime = (Date.now() - this.tickTime) / 1000;
        this.accY = deltaY / deltaTime;
        this.tickTime = Date.now();

        // Update
        let maxScrollY = heightPanel;
        if (heightFlatlistContent > heightFlatlist) {
            maxScrollY = heightFlatlistContent - (heightPanel - heightFlatlist - 18);
        }
        this.lastY = pageY;
        this.posY -= deltaY;
        this.posY = Math.max(this.posY, -maxScrollY);

        // Animation
        TimingAnimation(this.state.positionY, Math.min(Math.max(this.posY, -heightPanel), maxScreenY), 0).start();
        TimingAnimation(this.state.positionFlatlistY, -this.posY - (this.heightScreen * 2) / 3, 0).start();
    };

    /** @param {GestureResponderEvent} _event */
    onTouchEnd = (_event) => {
        if (this.posY < -this.heightPanel && this.posY - this.accY * 0.25 > -this.heightPanel) {
            this.posY = -this.heightPanel + this.heightScreen * 0.15;
        } else {
            this.posY -= this.accY * 0.25;
        }

        SpringAnimation(this.state.positionY, Math.max(this.posY, -this.heightPanel)).start();
        SpringAnimation(this.state.positionFlatlistY, -this.posY - (this.heightScreen * 2) / 3).start();

        if (this.posY > -100 && !this.isClosing) {
            this.Close();
        }

        this.isPressed = false;
    };

    /** @param {GestureResponderEvent} event */
    onBackgroundTouchStart = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        this.hasMoved = false;
        this.firstX = pageX;
        this.firstY = pageY;
    };

    /** @param {GestureResponderEvent} event */
    onBackgroundTouchMove = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        const deltaX = pageX - this.firstX;
        const deltaY = pageY - this.firstY;

        if (!this.hasMoved && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
            this.hasMoved = true;
        }
    };

    /** @param {GestureResponderEvent} event */
    onBackgroundTouchEnd = (event) => {
        if (event.target === event.currentTarget && !this.hasMoved) {
            this.Close();
        }
    };
}

export default ScreenListBack;
