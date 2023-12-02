import * as React from 'react';
import { View, Animated } from 'react-native';

import styles from './style';
import ScreenInputBack from './back';

import { Button, Input } from 'Interface/Components'

class ScreenInput extends ScreenInputBack {
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
                        ref={this.refInput}
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

export default ScreenInput;
