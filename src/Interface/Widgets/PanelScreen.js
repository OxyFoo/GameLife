import * as React from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 */

const PanelScreenProps = {
    /** @type {Array<JSX.Element>} */
    children: null,

    /** @type {StyleProp} */
    containerStyle: {},

    /** @type {number} Top distance of the panel when it's opened */
    topOffset: 0,

    /** @type {number} Offset to scroll down without closing panel */
    backOffset: 200,

    /** @type {boolean} No background when panel is opened */
    disableBackground: false,

    /** @type {() => void} */
    onClose: () => {}
}

class PanelScreen extends React.Component {
    state = {
        opened: false,
        positionY: new Animated.Value(SCREEN_HEIGHT),

        anim: new Animated.Value(0)
    };

    /** @type {number} Top distance of the panel when it's opened */
    posY = SCREEN_HEIGHT;

    /** @type {number} Max height of panel */
    height = 0;

    /** @type {boolean} Disable panel moving */
    scrollEnabled = true;

    /**
     * Open the screen list
     */
    Open = () => {
        if (this.state.opened) return;

        TimingAnimation(this.state.anim, 1, 200).start();
        this.setState({ opened: true });

        this.posY = this.props.topOffset;
        SpringAnimation(this.state.positionY, this.posY).start();
    }

    /**
     * Close the screen list
     */
    Close = () => {
        if (!this.state.opened) return;

        TimingAnimation(this.state.anim, 0, 200).start();
        this.setState({ opened: false });

        this.posY = SCREEN_HEIGHT;
        SpringAnimation(this.state.positionY, this.posY).start();
    }

    EnableScroll = () => this.scrollEnabled = true;
    DisableScroll = () => this.scrollEnabled = false;
    GotoY = (y) => {
        this.posY = y;
        SpringAnimation(this.state.positionY, this.posY).start();
    }
    RefreshPosition = () => {
        this.posY = Math.min(this.posY, this.props.topOffset);
        this.posY = Math.max(this.posY, SCREEN_HEIGHT - this.height);
        this.GotoY(this.posY);
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutPanel = (event) => {
        const { height } = event.nativeEvent.layout;
        this.height = height;
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        if (!this.scrollEnabled) return;

        const { pageY } = event.nativeEvent;
        this.lastY = pageY;
        this.accY = 0;

        this.tickTime = Date.now();
    }

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        if (!this.scrollEnabled) return;

        // Position
        const posY = event.nativeEvent.pageY;
        const deltaY = this.lastY - posY;

        // Acceleration
        const deltaTime = (Date.now() - this.tickTime) / 1000;
        this.accY = deltaY / deltaTime;
        this.tickTime = Date.now();

        // Update
        this.lastY = posY;
        this.posY -= deltaY;

        // Overscroll, smooth animation
        const maxTop = SCREEN_HEIGHT - this.height;
        if (this.posY < maxTop) {
            this.posY = maxTop - (maxTop - this.posY) / 8;
        }

        // Animation
        TimingAnimation(this.state.positionY, this.posY, 0.1).start();
    }

    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        if (!this.scrollEnabled) return;

        const { positionY } = this.state;
        const { topOffset, backOffset } = this.props;

        this.posY -= this.accY * .25;
        this.posY = Math.max(this.posY, SCREEN_HEIGHT - this.height);

        if (this.accY < -2000 || this.posY > topOffset + backOffset) {
            this.Close();
            setTimeout(this.props.onClose, 100);
        } else if (this.posY > topOffset) {
            this.posY = topOffset;
        }

        SpringAnimation(positionY, this.posY).start();
    }

    render() {
        const { opened, anim } = this.state;
        const { containerStyle, disableBackground } = this.props;

        const opacity = { opacity: anim };
        const event = opened ? 'box-none' : 'none';
        const stylePanel = {
            minHeight: this.height,
            transform: [{ translateY: this.state.positionY }],
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        return (
            <Animated.View
                style={[styles.parent, opacity]}
                pointerEvents={event}
            >
                {!disableBackground && (
                    <View
                        style={styles.background}
                        onTouchStart={this.onTouchStart}
                        onTouchMove={this.onTouchMove}
                        onTouchEnd={this.onTouchEnd}
                    />
                )}
                <Animated.View
                    style={[
                        styles.panel,
                        stylePanel,
                        containerStyle
                    ]}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    onLayout={this.onLayoutPanel}
                >
                    {this.props.children}
                </Animated.View>
            </Animated.View>
        );
    }
}

PanelScreen.prototype.props = PanelScreenProps;
PanelScreen.defaultProps = PanelScreenProps;

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: .8,
        backgroundColor: '#000000'
    },

    panel: {
        top: 0,
        width: '100%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    }
});

export default PanelScreen;