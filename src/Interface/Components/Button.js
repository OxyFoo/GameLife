import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import Text from './Text';
import Icon from './Icon';
import Ripple from './Ripple';
import { IsUndefined } from '../../Utils/Functions';

const ButtonProps = {
    style: {},
    styleAnimation: undefined,
    fontSize: 16,
    /**
     * @type {import('./Icon').Icons}
     */
    icon: '',
    iconXml: undefined,
    iconSize: 24,
    iconColor: 'white',
    iconAngle: 0,
    loading: false,
    color: 'transparent',
    colorText: 'primary',
    rippleColor: '#000000',
    borderRadius: 20,
    textComponent: true,
    enabled: true,
    onPress: () => {},
    onLongPress: () => {},
    onLayout: (event) => {},
    /**
     * @type {'auto'|'box-only'|'box-none'|'none'}
     */
    pointerEvents: 'box-only'
}

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.rippleRef = React.createRef(); 
        this.posX = 0; this.posY = 0; this.time = 0;
        this.state = { width: 0 };
    }

    onTouchStart = (event) => {
        this.rippleRef.current.onTouchStart(event);
        this.posX = event.nativeEvent.pageX;
        this.posY = event.nativeEvent.pageY;
        this.time = new Date().getTime();
    }
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

    onLayout = (event) => {
        this.props.onLayout(event);
        this.setState({ width: event.nativeEvent.layout.width });
    }

    render() {
        const children = this.props.children;
        const hasChildren = !IsUndefined(children);
        const hasIcon = this.props.icon !== '' || !IsUndefined(this.props.iconXml);
        const isLoading = this.props.loading;
        const onlyOneChild = !hasChildren || !hasIcon || isLoading;

        let color = themeManager.GetColor(this.props.color);
        if (!this.props.enabled) color = '#535C68';
        const align = onlyOneChild ? 'center' : 'space-between';
        const style = [
            styles.body,
            {
                justifyContent: align,
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
            content = <>
                        {hasChildren && <Text style={styles.text} color={this.props.colorText} fontSize={this.props.fontSize}>{children}</Text>}
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
                {this.props.textComponent ? content : children}
                <Ripple
                    ref={this.rippleRef}
                    parentWidth={this.state.width}
                    rippleColor={this.props.rippleColor}
                />
            </ButtonView>
        )
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