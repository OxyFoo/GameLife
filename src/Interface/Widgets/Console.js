import * as React from 'react';
import { View, Animated, StyleSheet, FlatList } from 'react-native';

import { Text, Button } from '../Components';
import { SpringAnimation } from '../../Functions/Animations';

/**
 * 0: Show all logs
 * 1: Show only warnings and errors
 * 2: Show only errors
 */
const LEVEL_CONSOLE = 2;

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
        // Add to app console
        const newMessage = [type, text];
        this.setState({ debug: [...this.state.debug, newMessage] });

        // Add to terminal
        let printLog = console.log;
        if (type === 'warn') printLog = console.warn;
        else if (type === 'error') printLog = console.error;

        if (LEVEL_CONSOLE === 0 ||
           (LEVEL_CONSOLE >= 1  && type === 'warn') ||
           (LEVEL_CONSOLE >= 2  && type === 'error')) {
            printLog(text);
        }
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
            <Animated.View style={[styles.console, translateY]} pointerEvents={'box-none'}>
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
                    pointerEvents={this.state.opened ? undefined : 'none'}
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
        borderRadius: 0,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16
    }
});

export default Console;