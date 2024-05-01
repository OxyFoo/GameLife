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
import { Ripple } from '../../Primitives/Ripple';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

class Button extends ButtonBack {
    render() {
        const {
            appearance, style: styleProp, styleAnimation, styleContent, enabled,
            onTouchStart, onTouchCancel, onTouchMove, onTouchEnd, onLayout,
            children, icon, iconSize, iconXml, iconAngle, loading,
            fontSize, onPress, onLongPress, ...rest
        } = this.props;

        const ButtonView = styleAnimation === null ? View : Animated.View;
        return (
            <ButtonView
                {...rest}
                style={[ styles.body, styleProp, styleAnimation ]}
                onTouchStart={this.onTouchStart}
                onTouchCancel={this.onTouchCancel}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
                onLayout={this.onLayout}
            >
                {this.renderBackground()}
                {this.renderContent()}

                {/** Ripple */}
                {enabled && (
                    <Ripple
                        ref={this.rippleRef}
                        rippleColor={appearance === 'normal' ? 'black' : 'white'}
                    />
                )}
            </ButtonView>
        );
    }

    renderContent() {
        const {
            children, appearance, loading, icon, iconXml,
            styleContent: styleContentProp, fontSize, enabled
        } = this.props;

        const hasChildren = typeof(children) !== 'undefined';
        const hasIcon = icon !== null || iconXml !== null;

        let content = children;
        let childCount = 1;

        // Loading icon
        if (loading) {
            content = (
                <Icon
                    style={styles.loadingIcon}
                    icon='loading-dots'
                    size={36}
                    color={'darkBlue'}
                />
            );
        }

        // Manage children
        else if (hasChildren) {
            if (typeof(children) === 'string') {
                content = (
                    <Text color={'darkBlue'} fontSize={fontSize}>
                        {children}
                    </Text>
                );
            }

            // Add icon after text
            if (hasIcon) {
                childCount = 2;
                content = (
                    <View style={styles.content}>
                        <Icon
                            icon={'default'}
                            size={this.props.iconSize}
                            color={'transparent'}
                        />
                        <View style={[styles.content, { flex: 1 }]}>
                            {content}
                        </View>
                        <Icon
                            icon={this.props.icon}
                            xml={this.props.iconXml}
                            size={this.props.iconSize}
                            color={'darkBlue'}
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
                    color={'darkBlue'}
                    angle={this.props.iconAngle}
                />
            );
        }

        /** @type {StyleProp} */
        const styleContent = {
            justifyContent: childCount === 1 ? 'center' : 'space-between',
            opacity: enabled ? 1 : 0.6
        };

        if (appearance === 'normal' || appearance === 'transparent') {
            return (
                <View style={[styles.content, styleContent, styleContentProp]} pointerEvents='none'>
                    {content}
                </View>
            );
        }

        else if (appearance === 'outline' || appearance === 'outline-blur') {
            return (
                <>
                    <View style={[styles.content, styleContent, styleContentProp]} pointerEvents='none'>
                        {content}
                    </View>
                    <MaskedView
                        style={[styles.absolute, styles.gradientContent]}
                        maskElement={(
                            <View style={[styles.content, styleContent, styleContentProp]}>
                                {content}
                            </View>
                        )}
                    >
                        <LinearGradient
                            style={{ width: '100%', height: '100%' }}
                            colors={['#8CF7FF', '#DBA1FF']}
                            useAngle={true}
                            angle={190}
                        />
                    </MaskedView>
                </>
            );
        }
    }

    renderBackground() {
        const { appearance } = this.props;

        if (appearance === 'normal') {
            return (
                <LinearGradient
                    style={styles.absolute}
                    colors={['#8CF7FF', '#DBA1FF']}
                    useAngle={true}
                    angle={267}
                />
            );
        }

        else if (appearance === 'outline') {
            return (
                <MaskedView
                    style={styles.absolute}
                    maskElement={(<View style={styles.backgroundView} />)}
                >
                    <LinearGradient
                        style={{ width: '100%', height: '100%' }}
                        colors={['#8CF7FF', '#DBA1FF']}
                        useAngle={true}
                        angle={267}
                    />
                </MaskedView>
            );
        }

        else if (appearance === 'outline-blur') {
            return (
                <>
                    <BlurView
                        style={[
                            styles.absolute,
                            styles.backgroundBlur,
                            {
                                backgroundColor: themeManager.GetColor('darkBlue', { opacity: .25 })
                            }
                        ]}
                        blurAmount={20}
                    />
                    <MaskedView
                        style={styles.absolute}
                        maskElement={(<View style={styles.backgroundView} />)}
                    >
                        <LinearGradient
                            style={{ width: '100%', height: '100%' }}
                            colors={['#8CF7FF', '#DBA1FF']}
                            useAngle={true}
                            angle={267}
                        />
                    </MaskedView>
                </>
            );
        }
    }
}

export { Button };
