import * as React from 'react';
import { StyleSheet, Image, View, Animated } from 'react-native';

import { OptionsAnimation } from '../Animations';

const LOGO_DIR = '../../../ressources/logo/';
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
            new Animated.Value(0), // Bar 3
            new Animated.Value(0)  // Bar 4 (= 3)
        ]
    }

    componentDidUpdate() {
        const state = this.props.state || 0;

        if (this.state.state !== state) {
            this.setState({ state: state });
            for (let i = 0; i < this.state.animOpacity.length; i++) {
                const light = i === state ? 1 : 0;
                const rnd = Math.random() * 250 + 250; // 250 - 500
                OptionsAnimation(this.state.animOpacity[i], light, rnd).start();
            }
        }
    }

    render() {
        const state = this.props.state || 0;
        const containerStyle = [ styles.content, this.props.style ];
        const inter = {
            inputRange: [0, .7, .85, 1],
            outputRange: [0, .8, .2, 1]
        };

        return (
            <View style={containerStyle}>
                <Animated.Image style={[styles.image, { opacity: this.state.animOpacity[state].interpolate(inter) }]} source={LOGOS[state]} />
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
        resizeMode: 'contain'
    }
});

export default GLLoading;