import * as React from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';

import { Text } from '../Components';
import { OptionsAnimation } from '../../Functions/Animations';

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.anim_ended = true;
        this.pressed = false;
    }

    state = {
        ripple_posX: 0,
        ripple_posY: 0,
        ripple_anim: new Animated.Value(0),
        ripple_opacity: new Animated.Value(0)
    }

    onTouchStart = (event) => {
        if (!this.anim_ended) {
            return;
        }
        this.pressed = true;
        this.anim_ended = false;
        const posX = event.nativeEvent.locationX;
        const posY = event.nativeEvent.locationY;
        this.setState({
            ripple_posX: posX,
            ripple_posY: posY
        });

        OptionsAnimation(this.state.ripple_opacity, 0.2, 100).start();
        OptionsAnimation(this.state.ripple_anim, 150, 300).start(() => {
            this.anim_ended = true;
            if (!this.pressed) {
                this.rippleHide();
            }
        });
    }
    onTouchEnd = (event) => {
        this.pressed = false;
        if (this.anim_ended) {
            this.rippleHide();
        }
        const posX = event.nativeEvent.locationX;
        const posY = event.nativeEvent.locationY;
        const { ripple_posX, ripple_posY } = this.state;
        const isPress = Math.abs(ripple_posX - posX) < 20 && Math.abs(ripple_posY - posY) < 20;
        callback = this.props.onPress;
        if (typeof(callback) === 'function' && isPress) {
            callback();
        }
    }

    rippleHide(duration = 200) {
        OptionsAnimation(this.state.ripple_opacity, 0, duration).start();
        OptionsAnimation(this.state.ripple_anim, 0, duration+100).start();
    }

    render() {
        const color = this.props.color || '#E0E0E0';
        const style = { ...styles.body, ...this.props.style, backgroundColor: color };

        return (
            <View
                style={style}
                onTouchStart={this.onTouchStart}
                onTouchEnd={this.onTouchEnd}
                pointerEvents={'box-only'}
            >
                <Text style={styles.text}>
                    {this.props.children}
                </Text>
                <Animated.View
                    style={[
                        styles.ripple, {
                        backgroundColor: this.props.rippleColor || '#000000',
                        opacity: this.state.ripple_opacity,
                        top: this.state.ripple_posY,
                        left: this.state.ripple_posX,
                        borderRadius: this.state.ripple_anim,
                        transform: [{ scale: this.state.ripple_anim }]
                    }]}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        width: '80%',
        height: 56,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 20,
        overflow: 'hidden'
    },
    ripple: {
        position: 'absolute',
        width: '2%',
        aspectRatio: 1
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        textTransform: 'uppercase'
    }
});

export default Button;