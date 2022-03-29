import * as React from 'react';
import { View, Animated, FlatList, StyleSheet, BackHandler } from 'react-native';

import user from '../../Managers/UserManager';

import { Text, Button } from '../Components';
import { SpringAnimation } from '../../Utils/Animations';

/**
 * @typedef {import('../../Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

/**
 * 0: Show all logs\
 * 1: Show only warnings and errors\
 * 2: Show only errors
 */
const LEVEL_CONSOLE = 0;

const ConsoleProps = {
}

class Console extends React.Component {
    state = {
        enabled: __DEV__,
        opened: false,
        animation: new Animated.Value(0),
        animationButton: new Animated.Value(0),

        debug: []
    }

    Enable = () => this.setState({ enabled: true });
    Disable = () => this.setState({ enabled: false });

    /**
     * Show message in app console
     * @param {'info'|'warn'|'error'} type
     * @param {String} text
     * @param {Array<any>} params
     * @returns {Number} index of the message
     */
    AddLog = (type, text, ...params) => {
        // Add to app console
        let messages = [...this.state.debug];
        const newMessage = [type, this.formatText(text, ...params)];
        messages.push(newMessage);
        this.setState({ debug: messages });

        // Add to terminal
        let printLog = console.log;
        if (type === 'warn') printLog = console.warn;
        else if (type === 'error') printLog = console.error;

        if (LEVEL_CONSOLE === 0 ||
           (LEVEL_CONSOLE >= 1  && type === 'warn') ||
           (LEVEL_CONSOLE >= 2  && type === 'error')) {
            printLog(text, ...params);
        }

        return messages.length - 1;
    }

    /**
     * Edit text in console, to update state debug
     * @param {Number} index
     * @param {String} text
     * @param {Array<any>} params
     * @returns {Boolean} Success of edition
     */
    EditLog = (index, text, ...params) => {
        let messages = [...this.state.debug];
        if (index < 0 || index >= messages.length) return false;

        const type = messages[index][0];
        const newMessage = [type, this.formatText(text, ...params)];
        messages.splice(index, 1, newMessage);
        this.setState({ debug: messages });

        if (LEVEL_CONSOLE === 0 ||
           (LEVEL_CONSOLE >= 1  && type === 'warn') ||
           (LEVEL_CONSOLE >= 2  && type === 'error')) {
            console.log(`Edit (${index}):`, text, ...params);
        }

        return true;
    }

    formatText = (text, ...params) => {
        const toString = (v) => typeof(v) === 'object' ? JSON.stringify(v) : v;
        return [text, ...params].map(toString).join(' ');
    }

    open = () => {
        this.setState({ opened: true });
        SpringAnimation(this.state.animation, 1).start();
        this.refDebug.scrollToEnd();
    }
    close = () => {
        this.setState({ opened: false });
        SpringAnimation(this.state.animation, 0).start();
        SpringAnimation(this.state.animationButton, 0).start();
    }
    showDeleteButton = () => {
        SpringAnimation(this.state.animationButton, -72).start();
    }

    deleteAll = async () => {
        user.Clear(false);
        BackHandler.exitApp();
    }

    renderText = ({ item }) => {
        const [type, text] = item;

        /** @type {ColorThemeText} */
        let color = 'primary';
        if (type === 'warn') color = 'warning';
        else if (type === 'error') color = 'error';

        return (
            <Text style={styles.text} color={color}>{text}</Text>
        );
    }
    render() {
        if (!this.state.enabled) return null;

        const interY = { inputRange: [0, 1], outputRange: [-256, 0] };
        const translateY = { transform: [{ translateY: this.state.animation.interpolate(interY) }] };
        const buttonDelete = { opacity: this.state.animation, transform: [{ translateY: this.state.animationButton }] };

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
                    onLongPress={this.Disable}
                >
                    Open console
                </Button>

                <Button
                    style={styles.buttonDelete}
                    styleAnimation={buttonDelete}
                    fontSize={14}
                    color='main1'
                    onPress={this.deleteAll}
                    pointerEvents={this.state.opened ? undefined : 'none'}
                >
                    Remove all data
                </Button>

                <Button
                    style={styles.buttonClose}
                    styleAnimation={{ opacity: this.state.animation }}
                    color='main2'
                    onPress={this.close}
                    onLongPress={this.showDeleteButton}
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
    text: {
        textAlign: 'left'
    },
    buttonOpen: {
        width: '40%',
        height: 36,
        paddingHorizontal: 0,
        borderRadius: 8
    },
    buttonDelete: {
        position: 'absolute',
        bottom: 0,
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