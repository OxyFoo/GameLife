import * as React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { LayoutChangeEvent } from 'react-native';

import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { Text, Button } from '../Components';
import { Sleep } from '../../Utils/Functions';
import { TimingAnimation } from '../../Utils/Animations';

/**
 * @typedef {Object} PopupTypes
 * @property {'ok'} ok
 * @property {'yes'|'no'} yesno
 * @property {'accept'|'refuse'} acceptornot
 * @property {null} custom
 */

const PopupProps = {
}

class Popup extends React.PureComponent {
    state = {
        opened: false,

        type: null,
        args: null,
        callback: () => {},
        cancelable: true,
        cross: true,
        x: 0, y: 0,

        animOpacity: new Animated.Value(0),
        animScale: new Animated.Value(.9)
    }

    /** @param {LayoutChangeEvent} e */
    onLayout = (e) => {
        const { x, y, } = e.nativeEvent.layout;
        this.setState({ x: x, y: y });
    }

    /**
     * Open popup after close current one
     */
    ForceOpen = async (type, args, callback, cancelable, cross) => {
        if (this.state.opened) {
            this.Close();
            await Sleep(250);
        }
        this.Open(type, args, callback, cancelable, cross);
    }

    /**
     * @template {keyof PopupTypes} T
     * @param {T} type
     * @param {Array<String>} args - [title, message]
     * @param {(button: PopupTypes[T]) => void} callback - Callback when popup button is pressed
     * @param {Boolean} cancelable - if true, popup can be closed by clicking outside
     * @param {Boolean} cross - if true, popup can be closed by clicking on X
     * @returns {Promise<void>} - Promise resolved when popup is opened
     */
    async Open(type, args, callback = () => {}, cancelable = true, cross = cancelable) {
        const { opened } = this.state;
        while (opened) await Sleep(500);

        this.setState({
            opened: true,
            type: type,
            args: args,
            callback: callback,
            cancelable: cancelable,
            cross: cross
        });

        TimingAnimation(this.state.animOpacity, 1, 200).start();
        TimingAnimation(this.state.animScale, 1, 200).start();
    }

    /**
     * Close popup
     * @param {Boolean} forceClose 
     * @returns {Boolean} - True if popup was closed
     */
    Close = (forceClose = true) => {
        const { opened, cancelable } = this.state;
        if (opened && (cancelable || forceClose)) {
            TimingAnimation(this.state.animOpacity, 0, 200).start();
            TimingAnimation(this.state.animScale, .9, 200).start();

            setTimeout(() => {
                this.setState({
                    opened: false,
                    type: null,
                    callback: () => {}
                });
            }, 150);

            return true;
        }
        return false;
    }

    content_message = () => {
        const title = (this.state.args[0] || '').toUpperCase();
        const message = this.state.args[1] || '';
        const ok = langManager.curr['modal']['btn-ok'];
        const yes = langManager.curr['modal']['btn-yes'];
        const no = langManager.curr['modal']['btn-no'];
        const accept = langManager.curr['modal']['btn-accept'];
        const refuse = langManager.curr['modal']['btn-refuse'];

        const callback = (type) => {
            this.state.callback(type);
            this.Close();
        }

        let buttons = <Button style={[styles.button, { width: '100%' }]} onPress={() => callback('ok')} color="main1">{ok}</Button>;
        if (this.state.type === 'yesno') buttons = (
            <>
                <Button style={styles.button} onPress={() => callback('no')} color="background" rippleColor='white'>{no}</Button>
                <Button style={styles.button} onPress={() => callback('yes')} color="main1">{yes}</Button>
            </>
        );
        if (this.state.type === 'acceptornot') buttons = (
            <>
                <Button style={styles.button} onPress={() => callback('refuse')} color="background">{refuse}</Button>
                <Button style={styles.button} onPress={() => callback('accept')} color="main1">{accept}</Button>
            </>
        );

        return (
            <>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                <View style={styles.row}>{buttons}</View>
            </>
        )
    }

    content() {
        let content;
        switch (this.state.type) {
            case 'ok':
            case 'yesno':
            case 'acceptornot':
                content = <this.content_message />;
                break;
            case 'custom':
                content = <this.state.args />;
                break;
            default:
                content = <></>;
                break;
        }
        return content
    }

    render() {
        const containerStyle = [
            styles.container,
            { backgroundColor: themeManager.GetColor('backgroundCard') },
            { transform: [{ scale: this.state.animScale }] }
        ];
        const buttonQuit = [
            styles.buttonQuit,
            { transform: [{ translateX: -this.state.x }, { translateY: this.state.y }] }
        ];

        return (
            <Animated.View
                style={[styles.parent, { opacity: this.state.animOpacity }]}
                pointerEvents={this.state.type !== null ? 'auto' : 'none'}
                onTouchEnd={() => { this.forceUpdate() }}
            >
                <View style={styles.background} onTouchStart={() => { this.Close(false) }} />
                {(this.state.cancelable || this.state.cross) && <Button style={buttonQuit} color='backgroundCard' colorText='main1' onPress={() => { this.Close(this.state.cross) }}>X</Button>}
                <Animated.View style={containerStyle} onLayout={this.onLayout}>
                    {this.content()}
                </Animated.View>
            </Animated.View>
        );
    }
}

Popup.prototype.props = PopupProps;
Popup.defaultProps = PopupProps;

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: .8,
        backgroundColor: '#000000'
    },
    container: {
        width: '80%',
        maxHeight: '60%',
        borderRadius: 16,
        overflow: 'hidden'
    },

    title: {
        fontSize: 20,
        marginVertical: 24,
        paddingHorizontal: 8
    },
    message: {
        paddingHorizontal: 8
    },
    row: {
        width: '100%',
        padding: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    button: {
        width: '45%',
        height: 48,
        borderRadius: 8
    },
    buttonQuit: {
        position: 'absolute',
        top: -48,
        right: 0,
        width: 36,
        height: 36,
        paddingHorizontal: 0,
        borderRadius: 4,
    }
});

export default Popup;