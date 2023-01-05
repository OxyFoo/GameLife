import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { LayoutChangeEvent } from 'react-native';

import user from '../../Managers/UserManager';

import { Button, Icon } from '../Components';
import { SpringAnimation } from '../../Utils/Animations';

const BottomBarProps = {
    show: false,
    selectedIndex: -1
}

class BottomBar extends React.Component {
    state = {
        show: false,
        height: 0,
        animPosY: new Animated.Value(128),

        selectedIndex: 0,
        barWidth: 0,
        animBarX: new Animated.Value(0)
    }

    componentDidUpdate() {
        // Show / Hide
        const newState = this.props.show;
        if (newState !== this.state.show) {
            this.setState({ show: newState });
            const toValue = newState ? 0 : 128;
            SpringAnimation(this.state.animPosY, toValue).start();
        }

        // Selectection bar
        const newIndex = this.props.selectedIndex;
        if (newIndex !== this.state.selectedIndex) {
            this.setState({ selectedIndex: newIndex });
            SpringAnimation(this.state.animBarX, newIndex * .2 * this.state.barWidth).start();
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ height: height + 24 }); // 24 = height of the half middle button
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutBody = (event) => {
        const { width } = event.nativeEvent.layout;
        this.setState({ barWidth: width });
    }

    goToHome = () => user.interface.ChangePage('home');
    goToCalendar = () => user.interface.ChangePage('calendar');
    goToActivity = () => user.interface.ChangePage('activity', undefined, true);
    goToMultiplayer = () => user.interface.ChangePage('multiplayer');
    goToShop = () => user.interface.ChangePage('shop');

    render() {
        const isChecked = (index) => index === this.state.selectedIndex ? '#9095FF' : '#6e6e6e';
        const stylePos = { transform: [{ translateY: this.state.animPosY }] };

        return (
            <Animated.View
                style={[styles.parent, stylePos]}
                onLayout={this.onLayout}
                pointerEvents={'box-none'}
            >
                <View style={styles.body} onLayout={this.onLayoutBody}>
                    {/* Selection bar */}
                    <Animated.View style={[styles.bar, { transform: [{ translateX: this.state.animBarX }] }]} />

                    {/* Buttons */}
                    <Button
                        style={{...styles.button, ...styles.btFirst}}
                        color='transparent'
                        borderRadius={0}
                        rippleColor='#9095FF'
                        onPress={this.goToHome}
                    >
                        <Icon icon='home' color={isChecked(0)} />
                    </Button>

                    <Button
                        style={styles.button}
                        color='transparent'
                        borderRadius={0}
                        rippleColor='#9095FF'
                        onPress={this.goToCalendar}
                    >
                        <Icon icon='calendar' color={isChecked(1)} />
                    </Button>



                    <Button
                        style={styles.button}
                        color='transparent'
                        borderRadius={0}>
                    </Button>



                    <Button
                        style={styles.button}
                        color='transparent'
                        borderRadius={0}
                        rippleColor='#9095FF'
                        onPress={this.goToMultiplayer}
                    >
                        <Icon icon='social' color={isChecked(3)} />
                    </Button>

                    <Button
                        style={{...styles.button, ...styles.btLast}}
                        color='transparent'
                        borderRadius={0}
                        rippleColor='#9095FF'
                        onPress={this.goToShop}
                    >
                        <Icon icon='shop' color={isChecked(4)} />
                    </Button>
                </View>

                {/* Add button */}
                <Animated.View style={styles.btMiddleParent} pointerEvents='box-none'>
                    <Button
                        style={styles.btMiddle}
                        onPress={this.goToActivity}
                        color='main2'
                        rippleColor='#000000'
                        icon='add'
                        borderRadius={50}
                    />
                </Animated.View>
            </Animated.View>
        );
    }
}

BottomBar.prototype.props = BottomBarProps;
BottomBar.defaultProps = BottomBarProps;

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        width: '100%',
        height: 96,
        bottom: 48,
        left: 0,
        paddingTop: 48,
        alignItems: 'center'
    },
    body: {
        flex: 1,
        width: '80%',
        minWidth: 260,
        maxWidth: 320,
        borderRadius: 20,
        flexDirection: 'row',
        backgroundColor: '#03052E'
    },
    button: {
        flex: 1,
        height: '100%',
        borderRadius: 0,
        justifyContent: 'center'
    },
    btFirst: {
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20
    },
    btMiddleParent: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 24,
        alignItems: 'center'
    },
    btMiddle: {
        height: '100%',
        aspectRatio: 1,
    },
    btLast: {
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
    },

    bar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '11%',
        height: 4,
        marginLeft: '3%',
        borderRadius: 8,
        backgroundColor: '#9095FF'
    }
});

export default BottomBar;