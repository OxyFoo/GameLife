import * as React from 'react';
import { View, Animated, FlatList, StyleSheet } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { Text, Button } from 'Interface/Components';
import { TimingAnimation, SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

/**
 * - 0: Show all logs
 * - 1: Show only warnings and errors
 * - 2: Show only errors
 * @type {0|1|2}
 */
const LEVEL_CONSOLE = 1;

const ConsoleProps = {
}

class Console extends React.Component {
    state = {
        enabled: false,
        opened: false,
        animation: new Animated.Value(-1),
        animationDeleteButtons: new Animated.Value(0),

        debug: []
    }

    /** State of delete buttons */
    toggle = false;

    Enable = () => {
        this.setState({ enabled: true });
        TimingAnimation(this.state.animation, 0, 400).start();
    }
    Disable = () => {
        TimingAnimation(this.state.animation, -1, 400).start(() => {
            this.setState({ enabled: false });
        });
    }

    /**
     * Show message in app console
     * @param {'info'|'warn'|'error'} type
     * @param {string} text
     * @param {Array<any>} params
     * @returns {number} index of the message
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

        if (LEVEL_CONSOLE === 0
            || (LEVEL_CONSOLE === 1  && type === 'warn')
            || (LEVEL_CONSOLE >= 1  && type === 'error')) {
            printLog(text, ...params);
        }

        // If error, send to server
        if (type === 'error' && !__DEV__ && user.server.online) {
            user.server.SendReport('error', messages.slice(-4));
        }

        // Scroll to end
        if (this.state.opened) {
            this.refDebug.scrollToEnd();
        }

        return messages.length - 1;
    }

    /**
     * Edit text in console, to update state debug
     * @param {number} index
     * @param {'info'|'warn'|'error'|'same'} type
     * @param {string} text
     * @param {Array<any>} params
     * @returns {boolean} Success of edition
     */
    EditLog = (index, type, text, ...params) => {
        let messages = [...this.state.debug];
        if (index < 0 || index >= messages.length) return false;

        const _type = type === 'same' ? messages[index][0] : type;
        const newMessage = [_type, this.formatText(text, ...params)];
        messages.splice(index, 1, newMessage);
        this.setState({ debug: messages });

        if (LEVEL_CONSOLE === 0 ||
           (LEVEL_CONSOLE >= 1  && _type === 'warn') ||
           (LEVEL_CONSOLE >= 2  && _type === 'error')) {
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
        TimingAnimation(this.state.animationDeleteButtons, 0).start();
    }
    toggleDeleteButtons = () => {
        this.toggle = !this.toggle;
        if (this.toggle) {
            SpringAnimation(this.state.animationDeleteButtons, 1).start();
        } else {
            TimingAnimation(this.state.animationDeleteButtons, 0).start();
        }
    }

    refreshInternalData = async () => {
        this.toggleDeleteButtons();

        dataManager.Clear();
        await dataManager.LocalSave(user);
        await dataManager.OnlineLoad(user);
        await dataManager.LocalSave(user);
    }

    deleteAll = async () => {
        await user.Clear(false);
        RNExitApp.exitApp();
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
        const buttonDelete = {
            opacity: this.state.animation,
            transform: [
                { translateY: Animated.multiply(-72, this.state.animationDeleteButtons) }
            ]
        };
        const buttonRefreshData = {
            opacity: this.state.animation,
            transform: [
                { translateY: Animated.multiply(-116, this.state.animationDeleteButtons) }
            ]
        };

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
                    styleAnimation={buttonRefreshData}
                    fontSize={14}
                    color='main1'
                    onPress={this.refreshInternalData}
                    pointerEvents={this.state.opened ? undefined : 'none'}
                >
                    Refresh internal data
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
                    onLongPress={this.toggleDeleteButtons}
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