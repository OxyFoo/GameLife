import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import { Random, Sleep } from 'Utils/Functions';
import { TimingAnimation } from 'Utils/Animations';

const ProgressBarProps = {
}

class ProgressBar extends React.Component {
    state = {
        animTranslate: new Animated.Value(0),
        animScale: new Animated.Value(0)
    }

    componentDidMount() {
        this.loop();
        this.interval = setInterval(this.loop, 2000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    loop = async () => {
        TimingAnimation(this.state.animTranslate, -1, 0, false).start();
        await Sleep(100);
        TimingAnimation(this.state.animTranslate, 1, 1800, false).start();
        TimingAnimation(this.state.animScale, .8, Random(300, 600), false).start();
        await Sleep(Random(600, 1200));
        TimingAnimation(this.state.animScale, .4, Random(300, 600), false).start();
    }

    render() {
        const inter = { inputRange: [0, 1], outputRange: ['0%', '100%'] };
        return (
            <View style={styles.parent}>
                <Animated.View style={[
                    styles.bar,
                    {
                        backgroundColor: themeManager.GetColor('main1'),
                        left: this.state.animTranslate.interpolate(inter),
                        transform: [
                            { scaleX: this.state.animScale }
                        ]
                    }
                ]} />
            </View>
        );
    }
}

ProgressBar.prototype.props = ProgressBarProps;
ProgressBar.defaultProps = ProgressBarProps;

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

export default ProgressBar;