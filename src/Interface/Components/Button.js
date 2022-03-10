import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle, LayoutChangeEvent, GestureResponderEvent } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import Text from './Text';
import Icon from './Icon';
import Ripple from './Ripple';
import { IsUndefined } from '../../Utils/Functions';

/**
 * @typedef {import('./Icon').Icons} Icons
 * @typedef {import('../../Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('../../Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const ButtonProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    /** @type {StyleProp<ViewStyle>?} */
    styleAnimation: undefined,

    /** @type {Number} */
    fontSize: 16,

    /** @type {Icons} */
    icon: '',

    /** @type {String?} */
    iconXml: undefined,

    /** @type {Number} */
    iconSize: 24,

    /** @type {ColorTheme} */
    iconColor: 'white',

    /** @type {Number} Angle in degrees */
    iconAngle: 0,

    /** @type {Boolean} If true, content will be replaced by loading icon & press event disabled */
    loading: false,

    /** @type {ColorTheme} */
    color: 'transparent',

    /** @type {ColorThemeText} */
    colorText: 'primary',

    /** @type {ColorTheme} */
    rippleColor: '#000000',

    /** @type {Number} */
    borderRadius: 12,

    /** @type {Boolean} If false, background is gray & press event disabled */
    enabled: true,

    /** @type {Function} */
    onPress: () => {},

    /** @type {Function} */
    onLongPress: () => {},

    /** @type {Function} */
    onLayout: (event) => {},

    /** @type {'auto'|'box-only'|'box-none'|'none'} */
    pointerEvents: 'box-only'
}

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.rippleRef = React.createRef(); 
        this.posX = 0; this.posY = 0; this.time = 0;
        this.state = { width: 0 };
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        this.rippleRef.current.onTouchStart(event);
        this.posX = event.nativeEvent.pageX;
        this.posY = event.nativeEvent.pageY;
        this.time = new Date().getTime();
    }

    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        this.rippleRef.current.onTouchEnd(event);

        const deltaX = Math.abs(event.nativeEvent.pageX - this.posX);
        const deltaY = Math.abs(event.nativeEvent.pageY - this.posY);
        const deltaT = new Date().getTime() - this.time;
        const isPress = deltaX < 20 && deltaY < 20;

        const { onPress, onLongPress } = this.props;
        if (isPress && !this.props.loading && this.props.enabled) {
            if (deltaT < 500) onPress();
            else onLongPress();
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        this.props.onLayout(event);
        this.setState({ width: event.nativeEvent.layout.width });
    }

    render() {
        const children = this.props.children;
        const hasChildren = !IsUndefined(children);
        const hasChildrenString = !IsUndefined(children) && typeof(children) === 'string';
        const hasIcon = this.props.icon !== '' || !IsUndefined(this.props.iconXml);
        const isLoading = this.props.loading;
        const onlyOneChild = !hasChildren || !hasIcon || isLoading;

        let color = themeManager.GetColor(this.props.color);
        if (!this.props.enabled) color = '#535C68';

        const style = [
            styles.body,
            {
                justifyContent: onlyOneChild ? 'center' : 'space-between',
                borderRadius: this.props.borderRadius,
                backgroundColor: color,
                opacity: this.props.enabled ? 1 : 0.6
            },
            this.props.style,
            this.props.styleAnimation
        ];
        const ButtonView = IsUndefined(this.props.styleAnimation) ? View : Animated.View;

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
                style={style}
                onTouchStart={this.onTouchStart}
                onTouchEnd={this.onTouchEnd}
                onLayout={this.onLayout}
                pointerEvents={this.props.pointerEvents}
            >
                {content}
                <Ripple
                    ref={this.rippleRef}
                    parentWidth={this.state.width}
                    rippleColor={this.props.rippleColor}
                />
            </ButtonView>
        );
    }
}

Button.prototype.props = ButtonProps;
Button.defaultProps = ButtonProps;

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
        color: '#FFFFFF',
        textTransform: 'uppercase'
    }
});

export default Button;