import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { minmax, sleep } from '../../Functions/Functions';
import {  SpringAnimation } from '../../Functions/Animations';

const XPBarProps = {
    value: 0,
    maxValue: 10,
    style: {}
}

class XPBar extends React.Component {
    state = {
        animation: new Animated.Value(1)
    }

    componentDidMount() {
        this.startAnimations();
    }
    
    startAnimations = async () => {
        const valueMax = parseInt(this.props.maxValue);
        const value = minmax(0, this.props.value, valueMax);
        const valueInt = 1 - (value / valueMax);

        await sleep(300);
        SpringAnimation(this.state.animation, valueInt, false).start();
    }

    render() {
        const style = { ...styles.body, ...this.props.style };
        const inter = { inputRange: [0, 1], outputRange: ['0%', '100%'] };

        return (
            <View style={style}>
                <LinearGradient
                    style={styles.bar}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#DBA1FF', '#9095FF', '#8CF7FF']}
                />
                <Animated.View
                    style={[styles.black, { width: this.state.animation.interpolate(inter) }]}
                />
            </View>
        )
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
        height: '100%',
        top: 0,
        right: 0,
        borderLeftWidth: 0.6,
        borderLeftColor: '#FFFFFF',
        backgroundColor: '#000000'
    }
});

export default XPBar;