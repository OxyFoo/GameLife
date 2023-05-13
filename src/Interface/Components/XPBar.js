import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { MinMax, Sleep } from '../../Utils/Functions';
import { SpringAnimation } from '../../Utils/Animations';

const XPBarProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    /** @type {number} */
    value: 0,

    /** @type {number} */
    maxValue: 10,

    /** @type {number} */
    supValue: 0,

    /** @type {number} To set the delay of the animation (delay * 200ms) */
    delay: 0
}

class XPBar extends React.Component {
    state = {
        width: 0,
        animation: new Animated.Value(0),
        animCover: new Animated.Value(0)
    }

    componentDidMount() {
        setTimeout(this.startAnimations, this.props.delay * 200);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value || prevProps.maxValue !== this.props.maxValue) {
            this.startAnimations();
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        this.setState({ width: width });
    }

    startAnimations = async () => {
        const valueMax = parseInt(this.props.maxValue);
        const value = MinMax(0, this.props.value, valueMax);
        const valueInt = value / valueMax;
        const valueCover = this.props.supValue / valueMax;

        await Sleep(300);
        SpringAnimation(this.state.animation, valueInt).start();
        await Sleep(300);
        SpringAnimation(this.state.animCover, valueCover).start();
    }

    render() {
        const style = { ...styles.body, ...this.props.style };
        const leftOffset = Animated.multiply(this.state.animation, this.state.width);
        const suppOffset = Animated.multiply(this.state.animCover, this.state.width);
        const black = [styles.black, { transform: [{ translateX: leftOffset } ]}];

        // Cover is used to show the progress of the next level
        // And preCover is used to avoid empty space at left with spring animation
        const preCover = [styles.preCover, { transform: [{ translateX: suppOffset } ]}];
        const cover = [styles.cover, { transform: [{ translateX: suppOffset } ]}];

        return (
            <View style={style} onLayout={this.onLayout}>
                <LinearGradient
                    style={styles.bar}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#DBA1FF', '#9095FF', '#8CF7FF']}
                />
                <Animated.View style={black}>
                    <Animated.View style={[cover, preCover]} />
                    <Animated.View style={cover} />
                </Animated.View>
            </View>
        );
    }
}

XPBar.prototype.props = XPBarProps;
XPBar.defaultProps = XPBarProps;

const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: 10,
        borderRadius: 8,
        overflow: 'hidden'
    },
    bar: {
        width: '100%',
        height: '100%'
    },
    black: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        borderLeftWidth: 0.6,
        borderLeftColor: '#FFFFFF',
        backgroundColor: '#000000',
        overflow: 'hidden'
    },
    preCover: {
        left: '-200%'
    },
    cover: {
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        minWidth: 0.6,
        height: '100%',
        opacity: 0.5,
        backgroundColor: '#FFFFFF'
    }
});

export default XPBar;