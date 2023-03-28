import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';

import user from '../../Managers/UserManager';
import themeManager from '../../Managers/ThemeManager';

import Button from './Button';
import { SpringAnimation } from '../../Utils/Animations';

const TextSwitchProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    /** @type {Array<string>} */
    texts: [],

    /** @param {number} index Called when seleted part change */
    onChange: (index) => {}
}

class TextSwitch extends React.Component {
    state = {
        anim: new Animated.Value(0),
        parentWidth: 0,
        selectedIndex: 0
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        if (width !== this.state.parentWidth) {
            this.setState({ parentWidth: width });
        }
    }

    /**
     * Set selected index
     * @param {number} index
     * @returns {boolean} True if index is valid
     */
    SetSelectedIndex(index) {
        if (index < 0 && index >= this.props.texts.length) {
            user.interface.console.AddLog('warn', 'TextSwitch index is out of bounds');
            return false;
        }

        this.onChange(index, false);
        return true;
    }

    onChange = (index, callback = true) => {
        if (callback) this.props.onChange(index);
        SpringAnimation(this.state.anim, index).start();
        this.setState({ selectedIndex: index });
    }

    render() {
        if (this.props.texts.length === 0) {
            user.interface.console.AddLog('warn', 'TextSwitch has no children');
            return null;
        }

        const childrenCount = this.props.texts.length;
        const parentStyle = [styles.parent, { borderColor: themeManager.GetColor('main1') }, this.props.style];
        const rippleColor = themeManager.GetColor('white');
        const selectColor = themeManager.GetColor('main1');
        const selectionInter = { inputRange: [0, 1], outputRange: [0, this.state.parentWidth/childrenCount] };
        const selectionStyle = [
            styles.selection,
            {
                width: this.state.parentWidth/childrenCount - 12,
                backgroundColor: selectColor,
                transform: [
                    { translateX: this.state.anim.interpolate(selectionInter) }
                ]
            }
        ];

        const width = { width: (100 - 5 * (childrenCount - 1)) / childrenCount + '%' };
        const addButtons = (text, index) => (
            <Button
                key={'bt-switch-' + index}
                style={[styles.button, width]}
                onPress={() => this.onChange(index)}
                rippleColor={rippleColor}
                fontSize={12}
            >
                {text}
            </Button>
        );

        return (
            <View style={parentStyle} onLayout={this.onLayout}>
                <Animated.View style={selectionStyle} />
                {this.props.texts.map(addButtons)}
            </View>
        );
    }
}

TextSwitch.prototype.props = TextSwitchProps;
TextSwitch.defaultProps = TextSwitchProps;

const styles = StyleSheet.create({
    parent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 55,
        padding: 4,
        borderWidth: 1.6,
        borderRadius: 16
    },
    button: {
        width: '47.5%',
        height: '100%',
        borderRadius: 8,
        paddingHorizontal: 6
    },
    selection: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: 4,
        borderRadius: 12
    }
});

export default TextSwitch;