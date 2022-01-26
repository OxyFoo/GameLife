import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { TimingAnimation } from '../../Functions/Animations';

import { Button, Input } from '../Components'

const ScreenInputProps = {
}

class ScreenInput extends React.Component {
    state = {
        opened: false,
        label: '',
        text: '',
        anim: new Animated.Value(0),
        callback: () => {}
    }

    Open = (label = 'Input', initialText = '', callback = (text) => {}) => {
        TimingAnimation(this.state.anim, 1, 200).start();
        this.setState({
            opened: true,
            label: label,
            text: initialText,
            callback: callback
        }, this.refInput.focus);
    }
    Close = (valid = false) => {
        if (valid) {
            this.state.callback(this.state.text);
        }
        TimingAnimation(this.state.anim, 0, 200).start();
        this.setState({
            opened: false,
            callback: () => {}
        });
    }

    onPressIn = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        this.posX = pageX;
        this.posY = pageY;
    }
    onPressOut = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        const deltaX = Math.abs(pageX - this.posX);
        const deltaY = Math.abs(pageY - this.posY);

        if (deltaX < 10 && deltaY < 10) {
            this.Close(false);
            this.refInput.unfocus(); // Hide keyboard
        }
    }
    onChangeText = (text) => this.setState({ text: text });

    onValid = () => {
        this.refInput.unfocus();
        this.Close(true);
    }

    render() {
        const { opened, anim, label, text } = this.state;
        const opacity = { opacity: anim };
        const event = opened ? 'auto' : 'none';

        return (
            <Animated.View style={[styles.parent, opacity]} pointerEvents={event}>
                <View
                    style={styles.background}
                    onTouchStart={this.onPressIn}
                    onTouchEnd={this.onPressOut}
                />
                <Input
                    ref={(ref) => { if (ref !== null) this.refInput = ref; }}
                    style={styles.input}
                    label={label}
                    text={text}
                    onChangeText={this.onChangeText}
                    onSubmit={this.onValid}
                />
                <Button
                    style={styles.button}
                    color='main1'
                    icon='chevron'
                    iconAngle={90}
                    onPress={this.onValid}
                />
            </Animated.View>
        );
    }
}

ScreenInput.prototype.props = ScreenInputProps;
ScreenInput.defaultProps = ScreenInputProps;

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 12,

        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: .8,
        backgroundColor: '#000000'
    },
    input: {
        width: '75%'
    },
    button: {
        width: '20%',
        borderRadius: 8
    }
});

export default ScreenInput;