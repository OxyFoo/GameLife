import * as React from 'react';
import { Animated, FlatList } from 'react-native';

import user from 'Managers/UserManager';

import { Sleep } from 'Utils/Functions';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {object} ScreenListItem
 * @property {number} id
 * @property {string} value
 */

class ScreenListBack extends React.Component {
    posY = 0;
    isPressed = false;

    heightPanel = 0;
    heightFlatlist = 0;
    heightFlatlistContent = 0;

    flatlistListener = null;

    /** @type {FlatList} */
    refFlatlist = null;

    /** @param {number} id */
    callback = (id) => {};

    state = {
        opened: false,
        positionY: new Animated.Value(0),
        positionFlatlistY: new Animated.Value(0),

        label: '',
        /** @type {Array<ScreenListItem>} */
        data: [],
        anim: new Animated.Value(0)
    }

    componentDidMount() {
        this.flatlistListener = this.state.positionFlatlistY.addListener(({ value }) => {
            this.refFlatlist?.scrollToOffset({ offset: value, animated: false });
        });
    }

    componentWillUnmount() {
        this.state.positionY.removeListener(this.flatlistListener);
    }

    /**
     * Open the screen list
     * @param {string} label 
     * @param {Array<ScreenListItem>} data
     * @param {(id: number) => void} callback (id) => {}
     */
    Open = (label = 'Input', data = [], callback = (id) => {}) => {
        TimingAnimation(this.state.anim, 1, 200).start();
        this.setState({
            opened: true,
            label: label,
            data: data
        }, async () => {
            // TODO: Wait real layout
            await Sleep(200); // Wait layout
            this.posY = Math.max(-this.heightPanel, -400);
            SpringAnimation(this.state.positionY, this.posY).start();
            this.callback = callback;
        });
    }

    /**
     * Close the screen list
     * @returns {boolean} True if closed
     */
    Close = () => {
        if (!this.state.opened) return false;

        TimingAnimation(this.state.anim, 0, 200).start();
        this.setState({
            opened: false,
            callback: () => {}
        });

        this.posY = 0;
        SpringAnimation(this.state.positionY, this.posY).start();
        SpringAnimation(this.state.positionFlatlistY, this.posY).start();

        return true;
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutPanel = (event) => {
        const { height } = event.nativeEvent.layout;
        this.heightPanel = height;
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutFlatList = (event) => {
        const { height } = event.nativeEvent.layout;
        this.heightFlatlist = height;
    }

    /** @param {number} width @param {number} height */
    onContentSizeChange = (width, height) => {
        this.heightFlatlistContent = height;
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        if (this.isPressed) return;

        const { pageY } = event.nativeEvent;
        this.lastY = pageY;
        this.accY = 0;

        this.isPressed = true;
        this.tickTime = Date.now();
        user.interface.console.AddLog('info', 'ScreenList onTouchStart');
    }

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        // Position
        const { pageY } = event.nativeEvent;
        const { heightFlatlistContent, heightPanel, heightFlatlist } = this;
        const deltaY = this.lastY - pageY;
        const maxScreenY = user.interface.screenHeight * .8;

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
        TimingAnimation(this.state.positionFlatlistY, -this.posY - user.interface.screenHeight * 2 / 3, 0).start();
    }

    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        if (this.posY < -this.heightPanel && this.posY - this.accY * .25 > -this.heightPanel) {
            this.posY = -this.heightPanel + user.interface.screenHeight * .15;
        } else {
            this.posY -= this.accY * .25;
        }

        SpringAnimation(this.state.positionY, Math.max(this.posY, -this.heightPanel)).start();
        SpringAnimation(this.state.positionFlatlistY, -this.posY - user.interface.screenHeight * 2 / 3).start();

        if (this.posY > -100) {
            this.Close();
        }

        this.isPressed = false;
    }
}

export default ScreenListBack;
