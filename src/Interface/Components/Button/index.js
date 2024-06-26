import * as React from 'react';
import { View, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import MaskedView from '@react-native-masked-view/masked-view';

import styles from './style';
import ButtonBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Text } from '../Text';
import { Icon } from '../Icon';
import { Ripple } from 'Interface/Primitives';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

class Button extends ButtonBack {
    render() {
        const {
            appearance,
            style: styleProp,
            styleAnimation,
            styleContent,
            enabled,
            onTouchStart,
            onTouchCancel,
            onTouchMove,
            onTouchEnd,
            onLayout,
            children,
            icon,
            iconSize,
            iconXml,
            iconAngle,
            loading,
            fontSize,
            color,
            pointerEvents,
            onPress,
            onLongPress,
            ...rest
        } = this.props;

        const ButtonView = styleAnimation === null ? View : Animated.View;
        return (
            // @ts-ignore
            <ButtonView
                {...rest}
                style={[styles.body, styleProp, styleAnimation]}
                onTouchStart={this.onTouchStart}
                onTouchCancel={this.onTouchCancel}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
                onLayout={this.onLayout}
                accessible={true}
                accessibilityRole='button'
                accessibilityState={{ disabled: !enabled }}
                pointerEvents={pointerEvents}
            >
                {this.renderBackground()}
                {this.renderContent()}

                {/** Ripple */}
                {enabled && <Ripple ref={this.rippleRef} rippleColor={appearance === 'normal' ? 'black' : 'white'} />}
            </ButtonView>
        );
    }

    renderContent = () => {
        const {
            children,
            appearance,
            loading,
            icon,
            iconXml,
            styleContent: styleContentProp,
            color,
            fontSize,
            fontColor,
            enabled
        } = this.props;

        const hasChildren = typeof children !== 'undefined';
        const hasIcon = icon !== null || iconXml !== null;

        let content = children;
        let childCount = 1;

        let _fontColor = fontColor;
        if (_fontColor === 'automatic') {
            if (appearance === 'uniform') {
                const luminance = themeManager.GetLuminance(themeManager.GetColor(color));
                _fontColor = luminance > 0.75 ? 'darkBlue' : 'white';
            } else {
                _fontColor = 'darkBlue';
            }
        }

        // Loading icon
        if (loading) {
            content = (
                <Icon
                    style={styles.loadingIcon}
                    icon='loading-dots'
                    size={this.props.iconSize - 2}
                    color={_fontColor}
                />
            );
        }

        // Manage children
        else if (hasChildren) {
            if (typeof children === 'string') {
                content = (
                    <Text color={_fontColor} fontSize={fontSize}>
                        {children}
                    </Text>
                );
            }

            // Add icon after text
            if (hasIcon) {
                childCount = 2;
                content = (
                    <View style={styles.content}>
                        <Icon icon={'default'} size={this.props.iconSize} color={'transparent'} />
                        <View style={[styles.content, styles.flex]}>{content}</View>
                        <Icon
                            icon={this.props.icon}
                            xml={this.props.iconXml}
                            size={this.props.iconSize}
                            color={_fontColor}
                            angle={this.props.iconAngle}
                        />
                    </View>
                );
            }
        }

        // Icon only
        else if (!hasChildren && hasIcon) {
            content = (
                <Icon
                    icon={this.props.icon}
                    xml={this.props.iconXml}
                    size={this.props.iconSize}
                    color={_fontColor}
                    angle={this.props.iconAngle}
                />
            );
        }

        /** @type {StyleProp} */
        const styleContent = {
            justifyContent: childCount === 1 ? 'center' : 'space-between',
            opacity: enabled ? 1 : 0.6
        };

        if (appearance === 'normal' || appearance === 'uniform' || fontColor !== 'automatic') {
            return (
                <View style={[styles.content, styleContent, styleContentProp]} pointerEvents='none'>
                    {content}
                </View>
            );
        } else if (appearance === 'outline' || appearance === 'outline-blur') {
            return (
                <View>
                    <View style={[styles.content, styleContent, styleContentProp]} pointerEvents='none'>
                        {content}
                    </View>
                    <MaskedView
                        style={styles.absolute}
                        maskElement={<View style={[styles.content, styleContent, styleContentProp]}>{content}</View>}
                    >
                        <LinearGradient
                            style={styles.fill}
                            colors={['#8CF7FF', '#DBA1FF']}
                            useAngle={true}
                            angle={190}
                        />
                    </MaskedView>
                </View>
            );
        }

        return null;
    };

    renderBackground = () => {
        const { appearance, color } = this.props;

        if (appearance === 'normal') {
            return (
                <LinearGradient style={styles.absolute} colors={['#8CF7FF', '#DBA1FF']} useAngle={true} angle={267} />
            );
        } else if (appearance === 'uniform') {
            return (
                <View
                    style={[
                        styles.absolute,
                        appearance === 'uniform' && {
                            backgroundColor: themeManager.GetColor(color)
                        }
                    ]}
                />
            );
        } else if (appearance === 'outline') {
            return (
                <MaskedView style={styles.absolute} maskElement={<View style={styles.backgroundView} />}>
                    <LinearGradient style={styles.fill} colors={['#8CF7FF', '#DBA1FF']} useAngle={true} angle={267} />
                </MaskedView>
            );
        } else if (appearance === 'outline-blur') {
            return (
                <>
                    <BlurView
                        style={[
                            styles.absolute,
                            styles.backgroundBlur,
                            {
                                backgroundColor: themeManager.GetColor('darkBlue', {
                                    opacity: 0.25
                                })
                            }
                        ]}
                        blurAmount={20}
                    />
                    <MaskedView style={styles.absolute} maskElement={<View style={styles.backgroundView} />}>
                        <LinearGradient
                            style={styles.fill}
                            colors={['#8CF7FF', '#DBA1FF']}
                            useAngle={true}
                            angle={267}
                        />
                    </MaskedView>
                </>
            );
        }

        return null;
    };
}

export { Button };
