import * as React from 'react';
import { StyleSheet, Animated, TextInput } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import Text from './Text';
import { TimingAnimation } from '../../Functions/Animations';

const InputProps = {
    style: {},
    label: 'Default',
    staticLabel: false,
    activeColor: 'main1',
    text: '',
    /**
     * @type {'default'|'email'|'username'|'name'} - The type of the input.
     */
    textContentType: 'default',
    onChangeText: (newText) => {},
    onSubmit: () => {},
    enabled: true,
    active: false,
    pointerEvents: 'auto'
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
        animTop: new Animated.Value(1),
        animLeft: new Animated.Value(16),
        animScale: new Animated.Value(1),

        isFocused: false,
        boxHeight: 0,
        borderWidth: 1.2,
        textWidth: 0,
        textHeight: 0
    }

    onBoxLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height !== this.state.boxHeight) {
            this.setState({ boxHeight: height });
        }
    }

    onTextLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width !== this.state.textWidth) {
            this.setState({ textWidth: width });
        }
        if (height !== this.state.textHeight) {
            this.setState({ textHeight: height });
        }
    }

    componentDidMount() {
        if (this.props.staticLabel || this.props.text.length > 0) {
            this.movePlaceHolderBorder();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.staticLabel) {
            this.movePlaceHolderBorder();
        }
        if (prevProps.text !== this.props.text) {
            if (this.props.text.length > 0) this.movePlaceHolderBorder();
            else if (!this.state.isFocused) this.movePlaceHolderIn();
        }
    }

    movePlaceHolderIn() {
        if (this.props.staticLabel) return;
        TimingAnimation(this.state.animTop, 1, ANIM_DURATION).start();
        TimingAnimation(this.state.animLeft, 16, ANIM_DURATION).start();
        TimingAnimation(this.state.animScale, 1, ANIM_DURATION).start();
        this.setState({ borderWidth: 1.2 });
    }

    movePlaceHolderBorder() {
        TimingAnimation(this.state.animTop, 0, ANIM_DURATION).start();
        TimingAnimation(this.state.animLeft, 8, ANIM_DURATION).start();
        TimingAnimation(this.state.animScale, 0.75, ANIM_DURATION).start();
        this.setState({ borderWidth: 1.6 });
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

    focus() {
        this.refInput.focus();
    }
    unfocus() {
        this.refInput.blur();
    }

    render() {
        const isActive = this.state.isFocused || this.props.active;
        const interH = { inputRange: [0, 1], outputRange: [-this.state.textHeight/2, this.state.boxHeight/2 - this.state.textHeight/2 - 2] }
        const activeColor = isActive ? this.props.activeColor : 'border';
        const hexActiveColor = themeManager.GetColor(activeColor);
        const hexBackgroundColor = themeManager.GetColor('background');
        const textColor = isActive ? themeManager.GetColor(this.props.activeColor) : 'primary';
        const interC = { inputRange: [0, 1], outputRange: [hexBackgroundColor+'FF', hexBackgroundColor+'00'] }
        const opacity = this.props.enabled ? 1 : 0.6;
        const barStyle = [styles.bar, {
            width: this.state.textWidth * 0.75 + 12,
            backgroundColor: hexBackgroundColor,
            transform: [
                { scaleX: Animated.subtract(1, this.state.animTop) },
            ]
        }];

        return (
            <Animated.View style={[styles.parent, {
                    backgroundColor: hexBackgroundColor,
                    borderColor: hexActiveColor,
                    borderWidth: this.state.borderWidth,
                    opacity: opacity
                }, this.props.style]}
                onLayout={this.onBoxLayout}
                pointerEvents={this.props.enabled ? this.props.pointerEvents : 'none'}
            >
                <Animated.View style={barStyle} />

                {/* Title (in center or move into top border if focused or active) */}
                <Animated.View
                    style={[styles.placeholderParent, {
                        //backgroundColor: this.state.animScale.interpolate(interC), // hexBackgroundColor,
                        //backgroundColor: hexBackgroundColor,
                        transform: [
                            { translateX: -this.state.textWidth/2 },
                            { translateY: -this.state.textHeight/2 },
                            { scale: this.state.animScale },
                            { translateX: this.state.textWidth/2 },
                            { translateY: this.state.textHeight/2 },

                            { translateX: this.state.animLeft },
                            { translateY: this.state.animTop.interpolate(interH) }
                        ]
                    }]}
                    pointerEvents={'none'}
                >
                    <Text
                        color={textColor}
                        fontSize={16}
                        onLayout={this.onTextLayout}
                    >
                        {this.props.label}
                    </Text>
                </Animated.View>

                <TextInput
                    ref={(input) => { this.refInput = input; }}
                    style={styles.input}
                    selectionColor={hexActiveColor}
                    value={this.props.text}
                    onChangeText={this.props.onChangeText}
                    onFocus={this.onFocusIn}
                    onBlur={this.onFocusOut}
                    onSubmitEditing={this.props.onSubmit}
                    textContentType={textTypes[this.props.textContentType]['ios']}
                    autoCompleteType={textTypes[this.props.textContentType]['android']}
                    autoCorrect={false}
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
        height: 56,
        color: '#FFFFFF',
        paddingHorizontal: 12
    },

    bar: {
        position: 'absolute',
        top: -2,
        left: 6,
        height: 3,
        backgroundColor: 'red'
    }
});

export default Input;