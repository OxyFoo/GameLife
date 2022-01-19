import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

const DotsProps = {
    style: {},
    pagesLength: 1,
    position: 0,

    colorDots: '#FFFFFF',
    colorActiveDot: 'main1'
}

class Dots extends React.Component {
    MainDot = () => {
        // inputRange: [0, 0.5, 1, 1.5, 2], outputRange: [0, 0, 1, 1, 2]
        let inputRange = [...Array(1 + 2*this.props.pagesLength).keys()].map((v, i) => v/2);
        let outputRange = inputRange.map((v, i) => Math.floor(v));
        const interLeft = { inputRange: inputRange, outputRange: outputRange };

        //inputRange = [0, .5, 1, 1.5, 2], outputRange = [8, 24, 8, 24, 8]
        outputRange = [...inputRange].map((_, i) => (_ % 1 == 0) ? 8 : 24);
        const interWidth = { inputRange: inputRange, outputRange: outputRange };

        const left = { left: Animated.multiply(this.props.position.interpolate(interLeft), 16) };
        const width = { width: this.props.position.interpolate(interWidth) };
        const bg = { backgroundColor: themeManager.GetColor(this.props.colorActiveDot) };
        return <Animated.View style={[styles.dot, styles.mainDot, left, width, bg]} />;
    }
    Dot = (_, index) => {
        const bg = { backgroundColor: themeManager.GetColor(this.props.colorDots) };
        return <View key={'dot-'+index} style={[styles.dot, bg]} />;
    }

    render() {
        return (
            <View style={[styles.parent, this.props.style]} pointerEvents='none'>
                <View style={styles.dotsContainer}>
                    {new Array(this.props.pagesLength).fill(0).map(this.Dot)}
                    <this.MainDot />
                </View>
            </View>
        );
    }
}

Dots.prototype.props = DotsProps;
Dots.defaultProps = DotsProps;

const styles = StyleSheet.create({
    parent: {
        display: 'flex',
        alignItems: 'center'
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    dot: {
        width: 8,
        height: 8,
        marginHorizontal: 4,
        borderRadius: 12
    },
    mainDot: {
        position: 'absolute',
        top: 0,
        left: 0
    }
});

export default Dots;