import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import user from '../../Managers/UserManager';
import { SpringAnimation } from '../../Functions/Animations';

import Button from './Button';
import Icon from './Icon';

const BottomBarProps = {
    show: false,
    selectedIndex: -1
}

class BottomBar extends React.Component {
    state = {
        show: false,
        animationShow: new Animated.Value(128),
        selectedIndex: 0,
        animationBar: new Animated.Value(0)
    }

    componentDidUpdate() {
        // Show / Hide
        const newState = this.props.show;
        if (newState !== this.state.show) {
            this.setState({ show: newState });
            const toValue = newState ? 0 : 128;
            SpringAnimation(this.state.animationShow, toValue, true).start();
        }

        // Selectection bar
        const newIndex = this.props.selectedIndex;
        if (newIndex !== this.state.selectedIndex) {
            this.setState({ selectedIndex: newIndex });
            SpringAnimation(this.state.animationBar, newIndex * .2, false).start();
        }
    }

    goToHome = () => user.changePage('home');
    goToCalendar = () => user.changePage('calendar');
    goToActivity = () => user.changePage('activity');
    goToSettings = () => user.changePage('settings');
    goToShop = () => user.changePage('shop');

    render() {
        const IntToPc = { inputRange: [0, 1], outputRange: ['0%', '100%'] };
        const isChecked = (index) => index === this.state.selectedIndex ? '#9095FF' : '#6e6e6e';

        return (
            <Animated.View style={[styles.parent, { transform: [{ translateY: this.state.animationShow }] }]} pointerEvents={'box-none'}>
                <View style={styles.body}>
                    {/* Selection bar */}
                    <Animated.View style={[styles.bar, { left: this.state.animationBar.interpolate(IntToPc) }]} />

                    {/* Buttons */}
                    <Button
                        rippleFactor={4}
                        onPress={this.goToHome}
                        style={{...styles.button, ...styles.btFirst}}
                        color='transparent'
                        rippleColor='#9095FF' borderRadius={0}
                    >
                        <Icon icon='home' color={isChecked(0)} />
                    </Button>

                    <Button
                        rippleFactor={4}
                        onPress={this.goToCalendar}
                        style={styles.button}
                        color='transparent'
                        rippleColor='#9095FF'
                        borderRadius={0}
                    >
                        <Icon icon='calendar' color={isChecked(1)} />
                    </Button>



                    <Button
                        rippleFactor={4}
                        style={styles.button}
                        color='transparent'
                        borderRadius={0}>
                    </Button>



                    <Button
                        rippleFactor={4}
                        onPress={this.goToSettings}
                        style={styles.button} color='transparent'
                        rippleColor='#9095FF'
                        borderRadius={0}
                    >
                        <Icon icon='social' color={isChecked(3)} />
                    </Button>

                    <Button
                        rippleFactor={4}
                        onPress={this.goToShop}
                        style={{...styles.button, ...styles.btLast}}
                        color='transparent'
                        rippleColor='#9095FF'
                        borderRadius={0}
                    >
                        <Icon icon='shop' color={isChecked(4)} />
                    </Button>
                </View>

                {/* Add button */}
                <View style={styles.btMiddleParent} pointerEvents='box-none'>
                    {/*<Button style={styles.btMiddle} onPress={this.goToActivity} color='#DBA1FF' rippleColor='#000000' borderRadius={50}>
                        <Icon icon='add' />
                    </Button>*/}
                    <Button
                        style={styles.btMiddle}
                        onPress={this.goToActivity}
                        color='#DBA1FF'
                        rippleColor='#000000'
                        icon='add'
                        borderRadius={50}
                    />
                </View>
            </Animated.View>
        )
    }
}

BottomBar.prototype.props = BottomBarProps;
BottomBar.defaultProps = BottomBarProps;

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        bottom: 48,
        left: 0,
        width: '80%',
        height: 96,
        paddingTop: 48,
        marginHorizontal: '10%'
    },
    body: {
        flex: 1,
        borderRadius: 20,
        flexDirection: 'row',
        backgroundColor: '#03052E'
    },
    button: {
        flex: 1,
        width: '100%',
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
        left: '0%',
        width: '11%',
        height: 4,
        marginLeft: '3%',
        borderRadius: 8,
        backgroundColor: '#9095FF'
    }
});

export default BottomBar;