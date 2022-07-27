import * as React from 'react';
import { Animated, StyleSheet, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import { StyleProp, ViewStyle, LayoutChangeEvent, GestureResponderEvent } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import { SpringAnimation, TimingAnimation } from '../../Utils/Animations';

const AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView);

const PageProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    /** @type {Boolean} If true, user can vertical scroll the page */
    scrollable: true,

    /** @type {Boolean} If true, user can scroll a little over the page for add a smooth effect */
    canScrollOver: true,

    /** @type {Number} */
    bottomOffset: 0,

    /** @type {React.Component} */
    topOverlay: null,

    /** @type {Number} */
    topOverlayHeight: 64,

    /** @type {LayoutChangeEvent} */
    onLayout: (event) => {},

    /** @type {GestureResponderEvent} */
    onStartShouldSetResponder: (event) => false
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

// TODO - Auto scroll if height change

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.posY = 0;
        this.scrollEnabled = true;
    }
    state = {
        height: 0,
        positionY: new Animated.Value(0),

        topOverlayShow: false,
        topOverlayPosition: new Animated.Value(1)
    }

    GotoY = (y) => {
        this.posY = this.limitValues(y, this.props.canScrollOver);
        SpringAnimation(this.state.positionY, this.posY).start();
    }
    EnableScroll = () => this.scrollEnabled = true;
    DisableScroll = () => this.scrollEnabled = false;

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const  { x, y, width, height } = event.nativeEvent.layout;
        if (height !== this.state.height) {
            this.setState({ height: height }, () => {
                this.posY = this.limitValues(this.posY);
                TimingAnimation(this.state.positionY, this.posY, 100).start();
            });
        }
        this.props.onLayout(event);
    }

    /** @param {Number} scrollY */
    onScroll = (scrollY) => {
        const { topOverlay, topOverlayHeight } = this.props;
        if (topOverlay !== null) {
            if (-scrollY > topOverlayHeight && !this.state.topOverlayShow) {
                this.setState({ topOverlayShow: true });
                TimingAnimation(this.state.topOverlayPosition, 0, 200).start();
            } else if (-scrollY < topOverlayHeight && this.state.topOverlayShow) {
                this.setState({ topOverlayShow: false });
                TimingAnimation(this.state.topOverlayPosition, 1, 200).start();
            }
        }
    }

    limitValues = (value, canScrollOver = false) => {
        if (!this.props.scrollable) {
            return 0;
        }

        const reduceScroll = 8;

        // No scroll over bottom
        const { height } = this.state;
        const bottom = value + height;
        const maxHeight = SCREEN_HEIGHT - this.props.bottomOffset;
        if (!canScrollOver) {
            if (bottom < maxHeight)
                value = maxHeight - height;
        }
        else if (height > maxHeight) {
            if (bottom < maxHeight)
                value = (maxHeight - height) + ((value - (maxHeight - height)) / reduceScroll);
        } else

        // Reduce over scroll bottom
        if (value < 0) {
            value /= reduceScroll;
        }

        // No scroll over top
        if (!canScrollOver)
            if (value > 0)
                value = 0;
        // Reduce over scroll top
        if (value > 0) value /= reduceScroll;
        return value;
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        if (!this.scrollEnabled) return;

        this.acc = 0;
        this.firstPosY = this.posY;
        this.firstTouchY = event.nativeEvent.pageY;

        this.tickPos = 0;
        this.tickTime = Date.now();
    }

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        if (!this.scrollEnabled) return;

        // Position
        const currPosY = event.nativeEvent.pageY;
        const deltaPosY = this.firstTouchY - currPosY;
        const newPosY = this.firstPosY - deltaPosY;

        // Acceleration
        const deltaTime = (Date.now() - this.tickTime) / 1000;
        this.acc = (newPosY - this.tickPos) / deltaTime;
        this.tickTime = Date.now();
        this.tickPos = newPosY;

        // Update
        this.posY = this.limitValues(newPosY, this.props.canScrollOver);
        TimingAnimation(this.state.positionY, this.posY, 0.1).start();
        this.onScroll(this.posY);
    }

    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        if (!this.scrollEnabled) return;

        let newPosY = this.posY + this.acc * 0.25;
        newPosY = this.limitValues(newPosY);

        this.posY = newPosY;
        if (Math.abs(this.acc) * 0.25 > 100) {
            SpringAnimation(this.state.positionY, newPosY).start();
        } else {
            TimingAnimation(this.state.positionY, newPosY, 200).start();
        }
        this.onScroll(this.posY);
    }

    renderOverlay() {
        if (this.props.topOverlay === null) return null;

        const { topOverlayPosition } = this.state;
        const { topOverlay, topOverlayHeight } = this.props;

        const animation = Animated.multiply(topOverlayPosition, -(topOverlayHeight + 32));
        const position = { transform: [{ translateY: animation }] };
        const backgroundColor = { backgroundColor: themeManager.GetColor('main3') };
        const borderColor = { borderColor: themeManager.GetColor('main1') };

        return (
            <Animated.View style={[styles.topOverlay, position, borderColor, backgroundColor]}>
                {topOverlay}
            </Animated.View>
        );
    }

    render() {
        const position = { transform: [{ translateY: this.state.positionY }] };

        return (
            <>
                <AnimatedKeyboardAvoidingView
                    style={[styles.parent, this.props.style, position]}
                    behavior={'padding'}
                    onLayout={this.onLayout}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    onStartShouldSetResponder={this.props.onStartShouldSetResponder}
                >
                    {this.props.children}
                </AnimatedKeyboardAvoidingView>
                {this.renderOverlay()}
            </>
        );
    }
}

Page.prototype.props = PageProps;
Page.defaultProps = PageProps;

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        padding: 32,
        paddingBottom: Platform.OS === 'ios' ? 48 : 32,
        backgroundColor: '#00000001'
    },
    topOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingVertical: 0,
        paddingHorizontal: 32,
        borderBottomWidth: 1
    }
});

export default Page;