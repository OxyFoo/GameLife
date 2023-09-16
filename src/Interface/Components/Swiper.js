import * as React from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import Dots from './Dots';
import { MinMax } from 'Utils/Functions';
import { TimingAnimation, SpringAnimation } from 'Utils/Animations';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 */

const SwiperProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number?} If undefined, height equals to max height of pages content */
    height: undefined,

    /** @type {number} */
    borderRadius: 16,

    /** @type {boolean} If true, automatically swipe to the next page */
    enableAutoNext: true,

    /** @type {boolean} */
    disableCircular: false,

    /** @type {number} Number of seconds to automatically swipe to the next page, if "enableAutoNext" is true */
    delayNext: 10,

    /** @type {Array<React.Component|React.ReactElement>} */
    pages: [],

    /** @type {number} */
    initIndex: 0,

    /** @type {ColorTheme} */
    backgroundColor: 'backgroundTransparent',

    /** @type {(index: number) => void} Callback is called when page index change */
    onSwipe: (index) => {},

    /** @type {(event: LayoutChangeEvent) => void} Callback is called when page layout change */
    onLayout: (event) => {}
}

class Swiper extends React.Component {
    constructor(props) {
        super(props);
        this.posX = this.props.initIndex;
    }

    state = {
        maxHeight: 0,
        positionX: new Animated.Value(this.props.initIndex),
        positionDots: new Animated.Value(this.props.initIndex)
    }

    componentDidMount() {
        this.startTimer();
    }
    componentWillUnmount() {
        this.stopTimer();
    }

    startTimer = () => {
        const { delayNext } = this.props;
        clearInterval(this.interval);
        this.interval = window.setInterval(this.Next, delayNext * 1000);
    }
    stopTimer = () => {
        clearInterval(this.interval);
    }

    Next = () => {
        const nextIndex = (this.posX + 1) % this.props.pages.length;
        this.posX = nextIndex;
        SpringAnimation(this.state.positionX, nextIndex, false).start();
        SpringAnimation(this.state.positionDots, nextIndex, false).start();
        this.props.onSwipe(nextIndex);
    }
    Prev = () => {
        const prevIndex = this.posX === 0 ? this.props.pages.length - 1 : this.posX - 1;
        this.posX = prevIndex;
        SpringAnimation(this.state.positionX, prevIndex, false).start();
        SpringAnimation(this.state.positionDots, prevIndex, false).start();
        this.props.onSwipe(prevIndex);
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        // Prevent vertical scroll when horizontal swipe
        event.stopPropagation();

        this.stopTimer();
        this.firstPosX = this.posX;
        this.firstTouchX = event.nativeEvent.pageX;

        this.tickPos = 0;
        this.tickTime = Date.now();
    }
    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        // Prevent vertical scroll when horizontal swipe
        event.stopPropagation();

        // Position
        const currPosX = event.nativeEvent.pageX;
        const deltaPosX = this.firstTouchX - currPosX;
        const newPosX = this.firstPosX + deltaPosX / SCREEN_WIDTH;

        // Acceleration
        const deltaTime = (Date.now() - this.tickTime) / 1000;
        this.acc = (newPosX - this.tickPos) / deltaTime;
        this.tickTime = Date.now();
        this.tickPos = newPosX;

        // Update
        this.posX = newPosX;
        const newDotPos = MinMax(0, newPosX, this.props.pages.length - 1);
        TimingAnimation(this.state.positionX, newPosX, 0.1, false).start();
        TimingAnimation(this.state.positionDots, newDotPos, 0.1, false).start();
    }
    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        // Prevent vertical scroll when horizontal swipe
        event.stopPropagation();

        // Define the next page index
        let newIndex = 0;
        const dec = (this.posX % 1) + this.acc;
        if (dec > 0.5) newIndex = Math.ceil(this.posX);
        else           newIndex = Math.floor(this.posX);

        // Go to the first page if swipe to the last page & vice versa
        if (!this.props.disableCircular) {
            if (newIndex < 0) newIndex = this.props.pages.length - 1;
            else if (newIndex >= this.props.pages.length) newIndex = 0;
        }
        newIndex = MinMax(0, newIndex, this.props.pages.length - 1);

        // Update
        this.posX = newIndex;
        SpringAnimation(this.state.positionX, newIndex, false).start();
        SpringAnimation(this.state.positionDots, newIndex, false).start();
        this.props.onSwipe(newIndex);

        this.startTimer();
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutPage = (event) => {
        const { height } = event.nativeEvent.layout;
        const { maxHeight } = this.state;

        if (height > maxHeight) {
            this.setState({ maxHeight: height });
        }
    }

    render() {
        if (this.props.pages.length === 0) return null;

        /** @type {StyleProp} */
        const pageWidth = {
            width: 100 / this.props.pages.length + '%',
            height: '100%',
            justifyContent: 'center'
        };
        const newPage = (p, index) => (
            <View
                key={'page-' + index}
                style={pageWidth}
                onLayout={this.onLayoutPage}
            >
                {p}
            </View>
        );
        const pages = this.props.pages.map(newPage);

        const inter = { inputRange: [0, 1], outputRange: ['0%', '100%'] };
        const contentContainerStyle = [styles.contentContainer, {
            left: Animated.subtract(0, this.state.positionX).interpolate(inter),
            width: this.props.pages.length * 100 + '%'
        }];

        return (
            <View
                style={[
                    styles.parent,
                    {
                        height: this.props.height || this.state.maxHeight,
                        backgroundColor: themeManager.GetColor(this.props.backgroundColor),
                        borderRadius: this.props.borderRadius
                    },
                    this.props.style
                ]}
                onLayout={this.props.onLayout}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
            >
                <Animated.View style={contentContainerStyle}>
                    {pages}
                </Animated.View>
                <Dots
                    style={styles.dots}
                    pagesLength={this.props.pages.length}
                    position={this.state.positionDots}
                />
            </View>
        );
    }
}

Swiper.prototype.props = SwiperProps;
Swiper.defaultProps = SwiperProps;

const styles = StyleSheet.create({
    parent: {
        overflow: 'hidden'
    },
    contentContainer: {
        position: 'absolute',
        flexDirection: 'row'
    },
    dots: {
        position: 'absolute',
        left: 0,
        bottom: 6,
        right: 0
    }
});

export default Swiper;