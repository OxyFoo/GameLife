import * as React from 'react';
import { View, Animated } from 'react-native';

import styles from './style';
import ContainerBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components/Text';
import { Icon } from 'Interface/Components';
import { Button } from 'Interface/Components';
import { Gradient } from 'Interface/Primitives';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 */

class Container extends ContainerBack {
    render() {
        const children = this.props.children;
        const contentHeight = Animated.multiply(this.state.animHeightContent, this.state.maxHeight);

        /** @type {StyleViewProp} */
        const contentStyle = {
            backgroundColor: themeManager.GetColor(this.props.backgroundColor),
            opacity: this.state.maxHeight === 0 && this.props.type === 'rollable' ? 0 : 1,
            maxHeight: this.state.maxHeight === 0 ? 'auto' : contentHeight
        };

        return (
            <View style={this.props.style} onLayout={this.props.onLayout}>
                {this.renderHeader()}
                <Animated.View style={[styles.content, contentStyle]} onLayout={this.onLayout}>
                    <View style={[styles.container, this.props.styleContainer]}>{children}</View>
                </Animated.View>
            </View>
        );
    }

    renderHeader = () => {
        const { type, text, textcolor, icon, iconSize, iconAngle, onIconPress } = this.props;

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
                style={[styles.headerButton, this.props.styleHeader]}
                styleAnimation={borderStyle}
                appearance='uniform'
                color='transparent'
                iconAngle={iconAngle}
                onPress={this.onChangeState}
            >
                <Gradient
                    style={styles.headerGradient}
                    containerStyle={styles.headerGradientContainer}
                    colors={[
                        themeManager.GetColor('main1', { opacity: 0.45 }),
                        themeManager.GetColor('main1', { opacity: 0.15 })
                    ]}
                >
                    <Text containerStyle={styles.textRollableHeader} color={textcolor}>
                        {text}
                    </Text>
                    <Animated.View style={{ transform: [{ rotateX: this.state.animAngleIcon.interpolate(interDeg) }] }}>
                        <Icon icon='chevron' size={18} angle={90} />
                    </Animated.View>
                </Gradient>
            </Button>
        );

        const headerStatic = (
            <Button
                style={[styles.staticHeader, this.props.styleHeader]}
                styleAnimation={borderStyle}
                appearance='uniform'
                color='transparent'
                pointerEvents='none'
            >
                <Gradient
                    style={styles.headerGradient}
                    containerStyle={styles.headerGradientContainer}
                    colors={[
                        themeManager.GetColor('main1', { opacity: 0.45 }),
                        themeManager.GetColor('main1', { opacity: 0.15 })
                    ]}
                >
                    <Text color={textcolor}>{text}</Text>

                    {(icon === null && <></>) || (
                        <Icon
                            containerStyle={styles.iconStaticHeader}
                            icon={icon}
                            size={iconSize}
                            angle={iconAngle}
                            onPress={onIconPress}
                        />
                    )}
                </Gradient>
            </Button>
        );

        return type === 'rollable' ? headerRollable : headerStatic;
    };
}

export { Container };
