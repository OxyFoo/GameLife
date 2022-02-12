import * as React from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';

import { SpringAnimation, TimingAnimation } from '../../Utils/Animations';

const PageProps = {
    style: {},
    scrollable: true,
    canScrollOver: true,
    bottomOffset: 156,
    onLayout: (event) => {},
    onStartShouldSetResponder: (event) => false,
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
        positionY: new Animated.Value(0)
    }

    GotoY = (y) => {
        this.posY = this.limitValues(y, true);
        SpringAnimation(this.state.positionY, this.posY).start();
    }
    EnableScroll = () => this.scrollEnabled = true;
    DisableScroll = () => this.scrollEnabled = false;

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

    onTouchStart = (event) => {
        if (!this.scrollEnabled) return;

        this.acc = 0;
        this.firstPosY = this.posY;
        this.firstTouchY = event.nativeEvent.pageY;

        this.tickPos = 0;
        this.tickTime = Date.now();
    }

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
    }

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
    }

    render() {
        const position = { transform: [{ translateY: this.state.positionY }] };

        return (
            <Animated.View
                style={[styles.parent, this.props.style, position]}
                onLayout={this.onLayout}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
                onStartShouldSetResponder={this.props.onStartShouldSetResponder}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}

Page.prototype.props = PageProps;
Page.defaultProps = PageProps;

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        padding: '5%',
        backgroundColor: '#00000001'
    }
});

export default Page;