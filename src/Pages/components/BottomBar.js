import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { OptionsAnimation, OptionsAnimationSpring } from '../../Functions/Animations';

import { Button } from '../Components';
import GLIconButton from './GLIconButton';

class BottomBar extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        selectedIndex: 0,
        animationBar: new Animated.Value(0)
    }

    changePage = (index) => {
        this.setState({ selectedIndex: index });
        OptionsAnimationSpring(this.state.animationBar, index * .2, false).start();
    }

    render() {
        const IntToPc = { inputRange: [0, 1], outputRange: ['0%', '100%'] };
        return (
            <Animated.View style={styles.parent}>
                <View style={styles.body}>
                    {/* Selection bar */}
                    <Animated.View style={[styles.bar, { left: this.state.animationBar.interpolate(IntToPc) }]} />

                    {/* Buttons */}
                    <Button onPress={() => this.changePage(0)} style={{...styles.button, ...styles.btFirst}} color='transparent' rippleColor='#9095FF'>
                        <GLIconButton svg='home' color={this.state.selectedIndex === 0 ? '#9095FF' : '#6e6e6e' } />
                    </Button>
                    <Button onPress={() => this.changePage(1)} style={styles.button} color='transparent' rippleColor='#9095FF'>
                        <GLIconButton svg='calendar' color={this.state.selectedIndex === 1 ? '#9095FF' : '#6e6e6e' } />
                    </Button>
                    <View style={{ flex: 1 }} />
                    <Button onPress={() => this.changePage(3)} style={styles.button} color='transparent' rippleColor='#9095FF'>
                        <GLIconButton svg='shop' color={this.state.selectedIndex === 3 ? '#9095FF' : '#6e6e6e' } />
                    </Button>
                    <Button onPress={() => this.changePage(4)} style={{...styles.button, ...styles.btLast}} color='transparent' rippleColor='#9095FF'>
                        <GLIconButton svg='social' color={this.state.selectedIndex === 4 ? '#9095FF' : '#6e6e6e' } />
                    </Button>
                </View>

                {/* Add button */}
                <View style={styles.btMiddleParent}>
                    <Button onPress={() => this.changePage(2)} style={styles.btMiddle} color='#DBA1FF' rippleColor='#000000'>
                        <GLIconButton svg='add' />
                    </Button>
                </View>
            </Animated.View>
        )
    }
}

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
        borderRadius: 0
    },
    btFirst: {
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20
    },
    btMiddleParent: {
        position: 'absolute',
        width: '100%',
        top: 24,
        alignItems: 'center'
    },
    btMiddle: {
        width: 50,
        height: 50,
        borderRadius: 50
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