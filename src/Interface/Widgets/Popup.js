import * as React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { Text, Button } from '../Components';
import { TimingAnimation } from '../../Functions/Animations';

const PopupProps = {
    type: null,
    args: null,
    cancelable: true,
    callback: () => {}
}

class Popup extends React.PureComponent {
    state = {
        opened: false,

        type: null,
        args: null,
        callback: () => {},
        cancelable: true,
        x: 0, y: 0,

        animOpacity: new Animated.Value(0),
        animScale: new Animated.Value(.9)
    }

    onLayout = (e) => {
        const { x, y, } = e.nativeEvent.layout;
        this.setState({ x: x, y: y });
    }

    Open = (type, args, callback = () => {}, cancelable = true) => {
        const { opened } = this.state;
        if (opened) return false;

        this.setState({
            opened: true,
            type: type,
            args: args,
            callback: callback,
            cancelable: cancelable
        });

        TimingAnimation(this.state.animOpacity, 1, 200).start();
        TimingAnimation(this.state.animScale, 1, 200).start();

        return true;
    }
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
                <Button style={styles.button} onPress={() => callback('no')} color="background">{no}</Button>
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
                <Text>{message}</Text>
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
                {this.state.cancelable && <Button style={buttonQuit} color='backgroundCard' colorText='main1' onPress={() => { this.Close(false) }}>X</Button>}
                <Animated.View style={containerStyle} onLayout={this.onLayout}>
                    {this.content()}
                </Animated.View>
            </Animated.View>
        )
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
        borderRadius: 16
    },

    title: {
        fontSize: 20,
        marginVertical: 24
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