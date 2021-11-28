import * as React from 'react';
import { StyleSheet, Animated, TextInput } from 'react-native';

import themeManager from '../../Managers/ThemeManager';
import { TimingAnimation } from '../../Functions/Animations';

import Text from './Text';

const InputProps = {
    style: {},
    label: 'Default',
    activeColor: 'main1',
    text: '',
    /**
     * @type {'default'|'email'|'username'|'name'} - The type of the input.
     */
    textContentType: 'default',
    onChangeText: () => {},
    enabled: true
}

const textTypes = {
    default: { ios: 'none', android: 'off' },
    email: { ios: 'emailAddress', android: 'email' },
    name: { ios: 'name', android: 'name' },
    username: { ios: 'username', android: 'username' }
}

const ANIM_DURATION = 200;

class Input extends React.Component {
    state = {
        animHeight: new Animated.Value(1),
        animTop: new Animated.Value(0),
        animLeft: new Animated.Value(12),
        animScale: new Animated.Value(1),
        animBorderWidth: new Animated.Value(1.2),

        isFocused: false,
        textWidth: 0
    }

    onLayout = (event) => {
        const  { x, y, width, height } = event.nativeEvent.layout;
        if (width !== this.state.textWidth) {
            this.setState({ textWidth: width });
        }
    }

    movePlaceHolderIn() {
        TimingAnimation(this.state.animHeight, 1, ANIM_DURATION, false).start();
        TimingAnimation(this.state.animTop, 0, ANIM_DURATION, false).start();
        TimingAnimation(this.state.animLeft, 12, ANIM_DURATION, false).start();
        TimingAnimation(this.state.animScale, 1, ANIM_DURATION, false).start();
        TimingAnimation(this.state.animBorderWidth, 1.2, ANIM_DURATION, false).start();
    }

    movePlaceHolderBorder() {
        TimingAnimation(this.state.animHeight, 0, ANIM_DURATION, false).start();
        TimingAnimation(this.state.animTop, -6, ANIM_DURATION, false).start();
        TimingAnimation(this.state.animLeft, 8, ANIM_DURATION, false).start();
        TimingAnimation(this.state.animScale, 0.75, ANIM_DURATION, false).start();
        TimingAnimation(this.state.animBorderWidth, 1.6, ANIM_DURATION, false).start();
    }

    onFocusIn = (ev, a) => {
        this.setState({ isFocused: true });
        this.movePlaceHolderBorder();
    }
    
    onFocusOut = () => {
        this.setState({ isFocused: false });
        if (!this.props.text.length) {
            this.movePlaceHolderIn();
        }
    }

    render() {
        const interH = { inputRange: [0, 1], outputRange: ['12%', '100%'] }
        const activeColor = this.state.isFocused ? this.props.activeColor : 'border';
        const hexActiveColor = themeManager.getColor(activeColor);
        const hexBackgroundColor = themeManager.getColor('background');
        const textColor = this.state.isFocused ? themeManager.getColor(this.props.activeColor) : 'primary';
        const interC = { inputRange: [0, 1], outputRange: [hexBackgroundColor+'FF', hexBackgroundColor+'00'] }
        const opacity = this.props.enabled ? 1 : 0.6;

        return (
            <Animated.View style={[styles.parent, {
                    backgroundColor: hexBackgroundColor,
                    borderColor: hexActiveColor,
                    borderWidth: this.state.animBorderWidth,
                    opacity: opacity
                }, this.props.style]}
                pointerEvents={this.props.enabled ? 'auto' : 'none'}
            >
                <Animated.View
                    style={[styles.placeholderParent, {
                        backgroundColor: this.state.animHeight.interpolate(interC), // hexBackgroundColor,
                        height: this.state.animHeight.interpolate(interH),
                        transform: [
                            { translateX: -this.state.textWidth/2 },
                            { scale: this.state.animScale },
                            { translateX: this.state.textWidth/2 },
                            { translateX: this.state.animLeft },
                            { translateY: this.state.animTop }
                        ]
                    }]}
                >
                    <Text
                        color={textColor}
                        fontSize={16}
                        onLayout={this.onLayout}
                        onPress={() => {}}
                    >
                        {this.props.label}
                    </Text>
                </Animated.View>
                <TextInput
                    style={styles.input}
                    selectionColor={hexActiveColor}
                    onChangeText={this.props.onChangeText}
                    onFocus={this.onFocusIn}
                    onBlur={this.onFocusOut}
                    textContentType={textTypes[this.props.textContentType]['ios']}
                    autoCompleteType={textTypes[this.props.textContentType]['android']}
                />
            </Animated.View>
        );
    }
}

Input.prototype.props = InputProps;
Input.defaultProps = InputProps;

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        borderRadius: 4
    },
    placeholderParent: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingHorizontal: 4,
        overflow: 'scroll',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        color: '#FFFFFF',
        paddingHorizontal: 12
    }
});

export default Input;