import * as React from 'react';
import { View, Animated, StyleSheet, FlatList } from 'react-native';

import { Text, Button } from '../Components';
import { SpringAnimation } from '../../Functions/Animations';

const ConsoleProps = {
    enable: false
}

class Console extends React.Component {
    state = {
        opened: false,
        animation: new Animated.Value(0),

        debug: []
    }

    /**
     * @param {'info'|'warn'|'error'} type
     * @param {String} text
     */
    AddDebug = (type, text) => {
        const newMessage = [type, text];
        this.setState({ debug: [...this.state.debug, newMessage] });
    }

    open = () => {
        this.setState({ opened: true });
        SpringAnimation(this.state.animation, 1).start();
        this.refDebug.scrollToEnd();
    }
    close = () => {
        this.setState({ opened: false });
        SpringAnimation(this.state.animation, 0).start();
    }

    renderText = ({ item }) => {
        const [type, text] = item;
        let color = '#ECECEC';
        if (type === 'warn') color = '#F1C40F';
        else if (type === 'error') color = '#E74C3C';
        return (
            <Text style={{ textAlign: 'left' }} color={color}>{text}</Text>
        );
    }
    render() {
        if (!this.props.enable) return null;

        const interY = { inputRange: [0, 1], outputRange: [-256, 0] };
        const translateY = { transform: [{ translateY: this.state.animation.interpolate(interY) }] };

        return (
            <Animated.View style={[styles.console, translateY]}>
                <View style={styles.content}>
                    <FlatList
                        ref={ref => { if (ref !== null) this.refDebug = ref }}
                        data={this.state.debug}
                        renderItem={this.renderText}
                        keyExtractor={(item, index) => 'debug-' + index}
                    />
                </View>

                <Button
                    style={styles.buttonOpen}
                    fontSize={14}
                    color='main1'
                    onPress={this.open}
                >
                    Open console
                </Button>

                <Button
                    style={styles.buttonClose}
                    styleAnimation={{ opacity: this.state.animation }}
                    color='main2'
                    onPress={this.close}
                    pointerEvents={this.state.opened ? 'auto' : 'none'}
                >
                    Close console
                </Button>
            </Animated.View>
        );
    }
}

Console.prototype.props = ConsoleProps;
Console.defaultProps = ConsoleProps;

const styles = StyleSheet.create({
    console: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center'
    },
    content: {
        width: '100%',
        height: 256,
        marginBottom: 24,
        padding: 24,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        backgroundColor: '#000'
    },
    buttonOpen: {
        width: '40%',
        height: 36,
        paddingHorizontal: 0,
        borderRadius: 8
    },
    buttonClose: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 60,
        borderRadius: 4
    }
});

export default Console;