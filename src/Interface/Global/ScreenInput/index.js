import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import ScreenInputBack from './back';

import { Button, InputText } from 'Interface/Components';

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
                    <InputText
                        ref={this.refInput}
                        style={styles.input}
                        label={input?.label}
                        value={text}
                        backgroundColor='backgroundInput'
                        onChangeText={this.onChangeText}
                        onSubmit={this.onValid}
                        multiline={input?.multiline}
                        maxLength={input?.maxLength}
                        showCounter
                    />
                    <Button style={styles.button} icon='check' onPress={this.onValid} />
                </Animated.View>
            </Animated.View>
        );
    }
}

export { ScreenInput };
