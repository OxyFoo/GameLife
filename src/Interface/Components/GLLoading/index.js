import * as React from 'react';
import { StyleSheet, View, Animated } from 'react-native';

import { TimingAnimation } from 'Utils/Animations';

const LOGO_DIR = '../../../../res/logo/';
const LOGOS = [
    require(LOGO_DIR + 'loading_0.png'),
    require(LOGO_DIR + 'loading_1.png'),
    require(LOGO_DIR + 'loading_2.png'),
    require(LOGO_DIR + 'loading_3.png'),
    require(LOGO_DIR + 'loading_3.png')
];

class GLLoading extends React.Component {
    state = {
        state: 0,
        animOpacity: [
            new Animated.Value(1), // Bar 0
            new Animated.Value(0), // Bar 1
            new Animated.Value(0), // Bar 2
            new Animated.Value(0)  // Bar 3
        ]
    }

    componentDidUpdate() {
        const state = this.props.state || 0;

        if (this.state.state !== state) {
            this.setState({ state: state });
            for (let i = 0; i < this.state.animOpacity.length; i++) {
                const light = i === state ? 1 : 0;
                if (light || i - 1 <= state) {
                    TimingAnimation(this.state.animOpacity[i], light, 200).start();
                }
            }
        }
    }

    render() {
        const containerStyle = [ styles.content, this.props.style ];

        return (
            <View style={containerStyle}>
                <Animated.Image style={[styles.image, { opacity: this.state.animOpacity[0] }]} source={LOGOS[0]} />
                <Animated.Image style={[styles.image, { position: 'absolute', opacity: this.state.animOpacity[1] }]} source={LOGOS[1]} />
                <Animated.Image style={[styles.image, { position: 'absolute', opacity: this.state.animOpacity[2] }]} source={LOGOS[2]} />
                <Animated.Image style={[styles.image, { position: 'absolute', opacity: this.state.animOpacity[3] }]} source={LOGOS[3]} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        display: 'flex',
        alignItems: 'center'
    },
    image: {
        width: 200,
        height: 120,
        resizeMode: 'contain',
        transform: [{ scale: 2.5 }]
    }
});

export default GLLoading;
