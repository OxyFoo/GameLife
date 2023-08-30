import * as React from 'react';
import { View, Animated, Keyboard, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';

import { TimingAnimation } from 'Utils/Animations';
import { Button, Input } from 'Interface/Components'

/**
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 */

const ScreenInputProps = {
}

class ScreenInput extends React.Component {
    state = {
        opened: false,
        label: '',
        text: '',
        multiline: false,
        anim: new Animated.Value(0),
        keyboardHeight: 0,
        callback: (text) => {},
        callbackClose: () => {}
    }

    componentDidMount() {
        Keyboard.addListener('keyboardDidShow', this.onKeyboardShow);
        Keyboard.addListener('keyboardDidHide', this.onKeyboardHide);
    }
    componentWillUnmount() {
        Keyboard.removeAllListeners('keyboardDidShow');
        Keyboard.removeAllListeners('keyboardDidHide');
    }
    onKeyboardShow = (event) => {
        const { height, screenY } = event.endCoordinates;
        this.setState({ keyboardHeight: Math.ceil(user.interface.screenHeight - screenY) });
    }
    onKeyboardHide = () => {
        this.setState({ keyboardHeight: 0 });
        this.refInput.unfocus();
        this.Close(false);
    }

    /**
     * Open the screen input
     * @param {string} label Title of the input
     * @param {string} initialText Initial text of the input
     * @param {(text: string) => void} callback Callback called when the input is validated
     * @param {boolean} multiline If true, the input is multiline
     * @param {() => void} callbackClose Callback called when the input is closed
     */
    Open = (label = 'Input', initialText = '', callback = (text) => {}, multiline = false, callbackClose = () => {}) => {
        TimingAnimation(this.state.anim, 1, 200).start();
        this.setState({
            opened: true,
            label: label,
            text: initialText,
            multiline: multiline,
            callback: callback,
            callbackClose: callbackClose
        }, this.refInput.focus);
    }

    /**
     * Close the screen input
     * @param {boolean} valid If true, the callback is called
     */
    Close = (valid = false) => {
        if (valid) {
            this.state.callback(this.state.text);
        }
        this.state.callbackClose();
        TimingAnimation(this.state.anim, 0, 200).start();
        this.setState({
            opened: false,
            callback: () => {}
        });
    }

    /** @param {GestureResponderEvent} event */
    onPressIn = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        this.posX = pageX;
        this.posY = pageY;
    }
    /** @param {GestureResponderEvent} event */
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
        const bottom = { transform: [{ translateY: -this.state.keyboardHeight - 56 }] };

        return (
            <Animated.View style={[styles.parent, opacity]} pointerEvents={event}>
                <View
                    style={styles.background}
                    onTouchStart={this.onPressIn}
                    onTouchEnd={this.onPressOut}
                />
                <View style={[styles.panel, bottom]}>
                    <Input
                        ref={(ref) => { if (ref !== null) this.refInput = ref; }}
                        style={styles.input}
                        label={label}
                        text={text}
                        onChangeText={this.onChangeText}
                        onSubmit={this.onValid}
                        multiline={this.state.multiline}
                        maxLength={this.state.multiline ? 1024 : 64}
                    />
                    <Button
                        style={styles.button}
                        color='main1'
                        icon='check'
                        onPress={this.onValid}
                    />
                </View>
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
        bottom: 0
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
    panel: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 12,

        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    input: {
        width: '75%',
        height: '100%'
    },
    button: {
        width: '20%',
        borderRadius: 8
    }
});

export default ScreenInput;