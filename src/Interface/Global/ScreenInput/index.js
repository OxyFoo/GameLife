import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import ScreenInputBack from './back';

import { Button, Input } from 'Interface/Components';

class ScreenInput extends ScreenInputBack {
    render() {
        const { opened, anim, input, text } = this.state;
        const opacity = { opacity: anim };
        const event = opened ? 'auto' : 'none';

        const animInput = {
            transform: [{ translateY: this.state.keyboardHeight }]
        };

        return (
            <Animated.View style={[styles.parent, opacity]} pointerEvents={event}>
                <View style={styles.background} onTouchStart={this.onPressIn} onTouchEnd={this.onPressOut} />
                <Animated.View style={[styles.panel, animInput]} onLayout={this.onLayout}>
                    <Input
                        ref={this.refInput}
                        style={styles.input}
                        label={input?.label}
                        text={text}
                        onChangeText={this.onChangeText}
                        onSubmit={this.onValid}
                        multiline={input?.multiline}
                        maxLength={input?.multiline ? 1024 : 64}
                    />
                    <Button style={styles.button} icon='check' onPress={this.onValid} />
                </Animated.View>
            </Animated.View>
        );
    }
}

export { ScreenInput };
