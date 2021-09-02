import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { OptionsAnimation } from '../Animations';
import user from '../../Managers/UserManager';
import GLText from './GLText';
import GLButton from './GLButton';
import langManager from '../../Managers/LangManager';
import GLDoubleCorner from './GLDoubleCorner';

class GLPopup extends React.PureComponent {
    state = {
        opened: false,
        type: null,
        cancelable: true,
        animOpacity: new Animated.Value(0),
        animScale: new Animated.Value(.9)
    }

    componentDidUpdate() {
        const propsOpened = this.props.type != null;
        if (typeof(propsOpened) === 'boolean') {
            if (propsOpened !== this.state.opened) {
                this.toggleVisibility();
            }
        }
    }

    toggleVisibility = () => {
        const opened = !this.state.opened;
        if (opened) {
            // Open
            this.setState({
                opened: opened,
                type: this.props.type,
                cancelable: this.props.cancelable
            });
            OptionsAnimation(this.state.animOpacity, 1, 200).start();
            OptionsAnimation(this.state.animScale, 1, 200, false).start();
        } else {
            // Close
            OptionsAnimation(this.state.animOpacity, 0, 200).start();
            OptionsAnimation(this.state.animScale, .9, 200, false).start();
            setTimeout(() => {
                this.setState({ opened: opened, type: null });
            }, 150);
        }
    }

    backgroundPress = () => {
        if (this.state.cancelable) {
            user.closePopup();
        }
    }

    content_message = () => {
        const title = (this.props.args[0] || '').toUpperCase();
        const message = this.props.args[1] || '';
        const ok = langManager.curr['modal']['btn-ok'];
        const yes = langManager.curr['modal']['btn-yes'];
        const no = langManager.curr['modal']['btn-no'];

        const callback = (type) => {
            const cb = this.props.callback;
            if (typeof(cb) === 'function') {
                cb(type);
            }
            user.closePopup();
        }

        let buttons = <GLButton value={ok} onPress={() => callback('ok')} />;
        if (this.state.type === 'yesno') buttons = (
            <>
                <GLButton value={no} onPress={() => callback('no')} />
                <GLButton value={yes} onPress={() => callback('yes')} color="grey" />
            </>
        )

        return (
            <>
                <GLText style={styles.title} title={title} />
                <GLText title={message} />
                <View style={styles.row}>{buttons}</View>
            </>
        )
    }

    content() {
        let content;
        switch (this.state.type) {
            case 'list':
                content = <this.props.args />;
                break;
            case 'ok':
            case 'yesno':
                content = <this.content_message />;
                break;
            default: content = <></>; break;
        }
        return content
    }

    render() {
        return (
            <Animated.View
                style={[styles.parent, { opacity: this.state.animOpacity }]}
                pointerEvents={this.props.type !== null ? 'auto' : 'none'}
                onTouchEnd={() => { this.forceUpdate() }}
            >
                <View style={styles.background} onTouchStart={this.backgroundPress} />
                <Animated.View style={[styles.container, {
                        transform: [{ scale: this.state.animScale }]
                    }]}
                >
                    {this.content()}
                    <GLDoubleCorner width={32} />
                </Animated.View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#00000011'
    },
    container: {
        width: '80%',
        borderColor: '#FFFFFF',
        borderWidth: 2
    },
    component: {
        margin: 4,
        paddingVertical: 4,
        textAlign: 'left'
    },

    title: {
        fontSize: 20,
        marginVertical: 24
    },
    row: {
        width: '100%',
        paddingVertical: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default GLPopup;