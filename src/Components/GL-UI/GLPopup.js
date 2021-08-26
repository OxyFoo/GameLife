import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { OptionsAnimation } from '../Animations';
import user from '../../Managers/UserManager';

class GLPopup extends React.PureComponent {
    state = {
        opened: false,
        animOpacity: new Animated.Value(0),
        animScale: new Animated.Value(.8)
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
        this.setState({ opened: opened });
        if (opened) {
            // Open
            OptionsAnimation(this.state.animOpacity, 1, 200).start();
            OptionsAnimation(this.state.animScale, 1, 200).start();
        } else {
            // Close
            OptionsAnimation(this.state.animOpacity, 0, 200).start();
            OptionsAnimation(this.state.animScale, .8, 200).start();
        }
    }

    render() {
        return (
            <Animated.View
                style={[styles.parent, { opacity: this.state.animOpacity }]}
                pointerEvents={this.props.type !== null ? 'auto' : 'none'}
                onTouchEnd={() => { this.forceUpdate() }}
            >
                <View style={styles.background} onTouchStart={user.closePopup} />
                <Animated.View style={[styles.container, {
                        transform: [{ scale: this.state.animScale }]
                    }]}
                >
                    {this.props.type === "list" && this.props.args.contentRender()}
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
        maxHeight: '50%',
        borderColor: '#FFFFFF',
        borderWidth: 2
    },
    component: {
        margin: 4,
        paddingVertical: 4,
        textAlign: 'left'
    }
});

export default GLPopup;