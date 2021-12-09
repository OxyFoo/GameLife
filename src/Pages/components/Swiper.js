import * as React from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

import themeManager from '../../Managers/ThemeManager';
import { minmax } from '../../Functions/Functions';
import { TimingAnimation, SpringAnimation } from '../../Functions/Animations';

import Dots from './Dots';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SwiperProps = {
    style: {},
    height: 128,
    borderRadius: 16,
    enableAutoNext: true,
    delayNext: 10,
    /**
     * @type {Array<Object>}
     */
    pages: [],
    backgroundColor: 'backgroundTransparent'
}

class Swiper extends React.Component {
    constructor(props) {
        super(props);
        this.posX = 0;
        this.nextIn = this.props.delayNext;
    }
    state = {
        positionX: new Animated.Value(0),
        positionDots: new Animated.Value(0)
    }

    componentDidMount() {
        this.interval = setInterval(this.loop, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    loop = () => {
        this.nextIn--;
        if (this.nextIn <= 0) {
            this.nextIn = this.props.delayNext;
            if (this.props.enableAutoNext) {
                const nextIndex = (this.posX + 1) % this.props.pages.length;
                this.posX = nextIndex;
                SpringAnimation(this.state.positionX, nextIndex, false).start();
                SpringAnimation(this.state.positionDots, nextIndex, false).start();
            }
        }
    }

    onTouchStart = (event) => {
        this.nextIn = this.props.delayNext;
        this.firstPosX = this.posX;
        this.firstTouchX = event.nativeEvent.pageX;

        this.tickPos = 0;
        this.tickTime = Date.now();
    }
    onTouchMove = (event) => {
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
        this.nextIn = this.props.delayNext;
        this.posX = newPosX;
        TimingAnimation(this.state.positionX, newPosX, 0.1, false).start();
        TimingAnimation(this.state.positionDots, minmax(0, newPosX, this.props.pages.length - 1), 0.1, false).start();
    }
    onTouchEnd = (event) => {
        let newPage = 0;
        const dec = (this.posX % 1) + this.acc;
        if (dec > 0.5) newPage = Math.ceil(this.posX);
        else           newPage = Math.floor(this.posX);
        newPage = minmax(0, newPage, this.props.pages.length - 1);

        this.nextIn = this.props.delayNext;
        this.posX = newPage;
        SpringAnimation(this.state.positionX, newPage, false).start();
        SpringAnimation(this.state.positionDots, newPage, false).start();
    }

    render() {
        if (this.props.pages.length === 0) return null;

        const pageWidth = { width: 100 / this.props.pages.length + '%' };
        const newPage = (p, index) => <View key={'page-'+index} style={[styles.page, pageWidth]}>{p}</View>;
        const pages = this.props.pages.map(newPage);

        const inter = { inputRange: [0, 1], outputRange: ['0%', '100%'] };
        const left = { left: Animated.subtract(0, this.state.positionX).interpolate(inter) };
        const width = { width: this.props.pages.length * 100 + '%' };

        return (
            <View
                style={[
                    styles.parent,
                    {
                        height: this.props.height,
                        backgroundColor: themeManager.getColor(this.props.backgroundColor),
                        borderRadius: this.props.borderRadius
                    },
                    this.props.style
                ]}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
            >
                <Animated.View style={[styles.contentContainer, width, left]}>
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
        height: '100%',
        flexDirection: 'row'
    },
    page: {
        height: '100%'
    },
    dots: {
        position: 'absolute',
        left: 0,
        bottom: 6,
        right: 0
    }
});

export default Swiper;