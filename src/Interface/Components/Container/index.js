import * as React from 'react';
import { View, Animated } from 'react-native';

import styles from './style';
import ContainerBack from './back';
import themeManager from 'Managers/ThemeManager';

import Text from 'Interface/Components/Text';
import Icon from 'Interface/Components/Icon';
import Button from 'Interface/Components/Button';

class Container extends ContainerBack {
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
                {icon !== null && (
                    <Icon
                        containerStyle={styles.iconStaticHeader}
                        icon={icon}
                        size={iconSize}
                        angle={iconAngle}
                        onPress={onIconPress}
                    />
                )}
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

export default Container;
