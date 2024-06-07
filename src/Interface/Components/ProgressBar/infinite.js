import * as React from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import { Random, Sleep } from 'Utils/Functions';
import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

const ProgressBarInfiniteProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {ThemeColor} */
    color: 'main1'
};

class ProgressBarInfinite extends React.Component {
    state = {
        animTranslate: new Animated.Value(0),
        animScale: new Animated.Value(1)
    }

    componentDidMount() {
        this.loop();
        this.interval = window.setInterval(this.loop, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    loop = async () => {
        const { width } = Dimensions.get('window');

        TimingAnimation(this.state.animTranslate, -width, 0).start();
        await Sleep(100);
        TimingAnimation(this.state.animTranslate, width, 1800).start();
        TimingAnimation(this.state.animScale, .8, 400).start();
        await Sleep(Random(600, 1200));
        TimingAnimation(this.state.animScale, .4, 400).start();
    }

    render() {
        const { color, style } = this.props;

        return (
            <View style={[styles.parent, style]}>
                <Animated.View style={[
                    styles.bar,
                    {
                        backgroundColor: themeManager.GetColor(color),
                        transform: [
                            { translateX: this.state.animTranslate },
                            { scaleX: this.state.animScale }
                        ]
                    }
                ]} />
            </View>
        );
    }
}

ProgressBarInfinite.prototype.props = ProgressBarInfiniteProps;
ProgressBarInfinite.defaultProps = ProgressBarInfiniteProps;

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        height: 4,
        backgroundColor: '#9095FF55',
        borderRadius: 24,
        overflow: 'hidden'
    },
    bar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 24
    }
});

export { ProgressBarInfinite };
