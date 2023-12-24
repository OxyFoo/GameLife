import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import PopupBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('./back').ContentArgs} ContentArgs
 * @typedef {import('./back').PopupTypes} PopupTypes
 */

class Popup extends PopupBack {
    content_message = () => {
        const title = (this.state.args[0] || '').toUpperCase();
        const message = this.state.args[1] || '';
        const ok = langManager.curr['modal']['btn-ok'];
        const yes = langManager.curr['modal']['btn-yes'];
        const no = langManager.curr['modal']['btn-no'];
        const accept = langManager.curr['modal']['btn-accept'];
        const refuse = langManager.curr['modal']['btn-refuse'];

        const callback = (type) => {
            this.Close();
            if (this.state.callback !== null) {
                this.state.callback(type);
            }
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
        );
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

        return content;
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
                {(this.state.cross) && <Button style={buttonQuit} color='backgroundCard' colorText='main1' onPress={() => { this.Close(this.state.cross) }}>X</Button>}
                <Animated.View style={containerStyle} onLayout={this.onLayout}>
                    {this.content()}
                </Animated.View>
            </Animated.View>
        );
    }
}

export default Popup;
