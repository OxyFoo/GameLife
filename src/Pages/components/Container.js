import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import themeManager from '../../Managers/ThemeManager';
import { TimingAnimation } from '../../Functions/Animations';

import Text from './Text';
import Button from './Button';
import Icon from './Icon';

const ContainerProps = {
    style: {},
    text: 'Title',
    textcolor: 'primary',
    color: 'main1',
    rippleColor: undefined,
    backgroundColor: 'backgroundTransparent',
    icon: '',
    iconAngle: 0,
    /**
     * @type {'static'|'rollable'}
     */
    type: 'static',
    opened: true,
    onChangeState: (opened) => {},
    onHeaderPress: () => {}
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

    onLayout = (event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        if (height > this.state.maxHeight) {
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

    render() {
        const children = this.props.children;
        const headerStyle = {
            borderBottomStartRadius: this.state.animBorderRadius,
            borderBottomEndRadius: this.state.animBorderRadius
        };
        const contentHeight = Animated.multiply(this.state.animHeightContent, this.state.maxHeight);
        const contentStyle = {
            backgroundColor: themeManager.getColor(this.props.backgroundColor),
            opacity: this.state.maxHeight === 0 && this.props.type === 'rollable' ? 0 : 1,
            height: this.state.maxHeight === 0 ? 'auto' : contentHeight
        };

        const interDeg = {
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        };

        return (
            <View style={this.props.style}>
                <Button
                    styleAnimation={headerStyle}
                    color={this.props.color}
                    icon={this.props.type === 'rollable' ? '' : this.props.icon}
                    iconAngle={this.props.iconAngle}
                    rippleColor={this.props.rippleColor}
                    borderRadius={8}
                    onPress={this.onChangeState}
                    pointerEvents={this.props.type === 'rollable' ? 'box-only' : 'none'}
                >
                    <Text
                        containerStyle={styles.textRollableHeader}
                        color={this.props.textcolor}
                    >
                        {this.props.text}
                    </Text>
                    <Animated.View style={{ transform: [{ rotateX: this.state.animAngleIcon.interpolate(interDeg) }] }}>
                        {this.props.type === 'rollable' && <Icon icon='chevron' size={18} angle={90} />}
                    </Animated.View>
                </Button>
                <Animated.View
                    style={[styles.content, contentStyle]}
                    onLayout={this.onLayout}
                >
                    <View style={{ padding: '5%' }}>
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
        paddingRight: 24
    },
    content: {
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
        overflow: 'hidden'
    }
});

export default Container;