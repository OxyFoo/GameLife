import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import Button from './Button';
import { SpringAnimation } from '../../Functions/Animations';

const TextSwitchProps = {
    style: {},
    textLeft: 'Left',
    textRight: 'Right',
    startRight: false,
    onChange: (index) => {}
}

class TextSwitch extends React.Component {
    state = {
        anim: new Animated.Value(0),
        parentWidth: 0,
        selectedIndex: 0
    }

    componentDidMount() {
        if (this.props.startRight) {
            this.onChange(1, false);
        }
    }

    onLayout = (event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        if (width !== this.state.parentWidth) {
            this.setState({ parentWidth: width });
        }
    }

    onChange = (index, callback = true) => {
        this.props.onChange(index);
        SpringAnimation(this.state.anim, index).start();
        this.setState({ selectedIndex: index });
    }

    render() {
        const parentStyle = [styles.parent, { borderColor: themeManager.GetColor('main1') }, this.props.style];
        const rippleColor = themeManager.GetColor('white');
        const selectColor = themeManager.GetColor('main1');
        const selectionInter = { inputRange: [0, 1], outputRange: [0, this.state.parentWidth/2] };
        const selectionStyle = [styles.selection, { width: this.state.parentWidth/2-12, backgroundColor: selectColor, transform: [{ translateX: this.state.anim.interpolate(selectionInter) }] }];

        return (
            <View style={parentStyle} onLayout={this.onLayout}>
                <Animated.View style={selectionStyle} />
                <Button style={[styles.button, { marginRight: '5%' }]} onPress={() => { this.onChange(0) }} rippleColor={rippleColor} fontSize={12}>{this.props.textLeft}</Button>
                <Button style={styles.button} onPress={() => { this.onChange(1) }} rippleColor={rippleColor} fontSize={12}>{this.props.textRight}</Button>
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
        height: 55,
        padding: 4,
        borderWidth: 1.6,
        borderRadius: 16
    },
    button: {
        width: '47.5%',
        height: '100%',
        borderRadius: 8
    },
    selection: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: 4,
        width: '50%',
        borderRadius: 12
    }
});

export default TextSwitch;