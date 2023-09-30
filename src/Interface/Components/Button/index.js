import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import ButtonBack from './back';
import themeManager from 'Managers/ThemeManager';

import Ripple from '../Ripple';
import { Text, Icon } from 'Interface/Components';
import { IsUndefined } from 'Utils/Functions';

class Button extends ButtonBack {
    render() {
        const {
            children,
            style: styleProp,
            styleAnimation,
            enabled,
            loading,
            icon,
            iconXml
        } = this.props;
        const hasChildren = !IsUndefined(children);
        const hasChildrenString = !IsUndefined(children) && typeof(children) === 'string';
        const hasIcon = icon !== null || !IsUndefined(iconXml);
        const onlyOneChild = !hasChildren || !hasIcon || loading;

        const color = enabled ? themeManager.GetColor(this.props.color) : '#535C68';
        const style = [
            styles.body,
            {
                justifyContent: onlyOneChild ? 'center' : 'space-between',
                borderRadius: this.props.borderRadius,
                backgroundColor: color,
                opacity: enabled ? 1 : 0.6
            },
            styleProp,
            styleAnimation
        ];
        const ButtonView = styleAnimation === null ? View : Animated.View;

        let content;
        if (this.props.loading) {
            content = <Icon icon='loadingDots' size={this.props.iconSize + 8} color={this.props.iconColor} />;
        } else {
            const text = hasChildrenString ? <Text style={styles.text} color={this.props.colorText} fontSize={this.props.fontSize}>{children}</Text> : children;
            content = <>
                        {hasChildren && text}
                        {hasIcon     && <Icon icon={this.props.icon} xml={this.props.iconXml} size={this.props.iconSize} color={this.props.iconColor} angle={this.props.iconAngle} />}
                    </>;
        }

        return (
            <ButtonView
                testID={this.props.testID}
                style={style}
                onTouchStart={this.onTouchStart}
                onTouchCancel={this.onTouchCancel}
                onTouchEnd={this.onTouchEnd}
                onLayout={this.onLayout}
                pointerEvents={this.props.pointerEvents}
            >
                {content}
                {enabled && (
                    <Ripple
                        ref={this.rippleRef}
                        parentWidth={this.state.width}
                        rippleColor={this.props.rippleColor}
                    />
                )}
            </ButtonView>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        height: 56,
        paddingHorizontal: 24,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',

        overflow: 'hidden'
    },
    text: {
        textTransform: 'uppercase'
    }
});

export default Button;