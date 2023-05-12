import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import Text from './Text';
import Icon from './Icon';
import Button from './Button/Button';
import { TimingAnimation } from '../../Utils/Animations';

/**
 * @typedef {import('../../Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('../../Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const ContainerProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    /** @type {StyleProp<ViewStyle>} */
    styleHeader: {},

    /** @type {StyleProp<ViewStyle>} */
    styleContainer: {},

    /** @type {string} */
    text: 'Title',

    /** @type {ColorThemeText} */
    textcolor: 'primary',

    /** @type {ColorTheme} */
    color: 'main1',

    /** @type {ColorTheme} */
    rippleColor: undefined,

    /** @type {ColorTheme} */
    backgroundColor: 'backgroundTransparent',

    /** @type {import('./Icon').Icons} Show the icon on the right side of the text, for static container */
    icon: '',

    /** @type {number} Size of the icon in pixels */
    iconSize: 24,

    /** @type {number} Angle of the icon in degrees */
    iconAngle: 0,

    /** @type {'static'|'rollable'} */
    type: 'static',

    /** @type {boolean} */
    opened: true,

    /** @type {Function} */
    onChangeState: (opened) => {},

    /** @type {Function?} For static container with an icon, event of icon press */
    onIconPress: undefined,

    /** @type {(event: LayoutChangeEvent) => void} event */
    onLayout: undefined
}

class Container extends React.Component {
    state = {
        animAngleIcon: new Animated.Value(0),
        animHeightContent: new Animated.Value(0),
        animBorderRadius: new Animated.Value(8),
        opened: false,
        maxHeight: 0
    }

    componentDidMount() {
        if (this.props.opened !== this.state.opened) {
            TimingAnimation(this.state.animAngleIcon, 0, 0, false).start();
            TimingAnimation(this.state.animHeightContent, 0, 0, false).start();
            TimingAnimation(this.state.animBorderRadius, 8, 0, false).start();
            this.onChangeState();
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        if (height > this.state.maxHeight && this.props.type === 'rollable') {
            this.setState({ maxHeight: height });
        }
    }

    onChangeState = () => {
        const newState = !this.state.opened;
        this.setState({ opened: newState });
        this.props.onChangeState(newState);

        TimingAnimation(this.state.animAngleIcon, newState ? 1 : 0, 400, false).start();
        TimingAnimation(this.state.animHeightContent, newState ? 1 : 0, 300, false).start();
        TimingAnimation(this.state.animBorderRadius, newState ? 0 : 8, newState ? 50 : 800, false).start();
    }

    renderHeader = () => {
        const { type, color, rippleColor, text, textcolor,
            icon, iconSize, iconAngle, onIconPress } = this.props;

        const borderStyle = {
            borderBottomStartRadius: this.state.animBorderRadius,
            borderBottomEndRadius: this.state.animBorderRadius
        };
        const interDeg = {
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        };

        const headerRollable = (
            <Button
                style={this.props.styleHeader}
                styleAnimation={borderStyle}
                color={color}
                icon={''}
                iconAngle={iconAngle}
                rippleColor={rippleColor}
                borderRadius={8}
                onPress={this.onChangeState}
            >
                <Text containerStyle={styles.textRollableHeader} color={textcolor}>
                    {text}
                </Text>
                <Animated.View style={{ transform: [{ rotateX: this.state.animAngleIcon.interpolate(interDeg) }] }}>
                    <Icon icon='chevron' size={18} angle={90} />
                </Animated.View>
            </Button>
        );
        const headerStatic = (
            <Button
                style={[{ justifyContent: 'space-between' }, this.props.styleHeader]}
                styleAnimation={borderStyle}
                color={color}
                rippleColor='transparent'
                borderRadius={8}
                pointerEvents='box-none'
            >
                <Text color={textcolor}>
                    {text}
                </Text>
                <Icon
                    containerStyle={styles.iconStaticHeader}
                    icon={icon}
                    size={iconSize}
                    angle={iconAngle}
                    onPress={onIconPress}
                />
            </Button>
        );

        return type === 'rollable' ? headerRollable : headerStatic;
    }

    render() {
        const children = this.props.children;
        const contentHeight = Animated.multiply(this.state.animHeightContent, this.state.maxHeight);
        const contentStyle = {
            backgroundColor: themeManager.GetColor(this.props.backgroundColor),
            opacity: this.state.maxHeight === 0 && this.props.type === 'rollable' ? 0 : 1,
            maxHeight: this.state.maxHeight === 0 ? 'auto' : contentHeight
        };

        return (
            <View style={this.props.style} onLayout={this.props.onLayout}>
                {this.renderHeader()}
                <Animated.View
                    style={[styles.content, contentStyle]}
                    onLayout={this.onLayout}
                >
                    <View style={[{ padding: 24 }, this.props.styleContainer]}>
                        {children}
                    </View>
                </Animated.View>
            </View>
        );
    }
}

Container.prototype.props = ContainerProps;
Container.defaultProps = ContainerProps;

const styles = StyleSheet.create({
    header: {
        borderBottomStartRadius: 0,
        borderBottomEndRadius: 0
    },
    textRollableHeader: {
        padding:0,
        paddingRight: 24
    },
    iconStaticHeader: {
        width: 'auto',
        height: 'auto',
        padding: 12,
        paddingRight: 0
    },
    content: {
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
        overflow: 'hidden'
    }
});

export default Container;