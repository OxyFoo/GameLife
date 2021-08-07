import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import GLText from './GLText';
import { OptionsAnimation } from '../Animations';

class GLBottomModal extends React.Component {
    state = {
        opened: false,
        animOpacity: new Animated.Value(0)
    }

    componentDidUpdate() {
        if (this.state.opened != this.props.enabled) {
            this.setState({ opened: this.props.enabled });
            this.toggleModal();
        }
    }

    toggleModal = () => {
        if (this.state.opened) {
            OptionsAnimation(this.state.animOpacity, 0).start();
        } else {
            OptionsAnimation(this.state.animOpacity, 1).start();
        }
    }
    
    render() {
        const inter = {
            inputRange:  [0, 0.4, 0.8, 1],
            outputRange: [0, 0.8, 0.2, 1]
        };

        return (
            <Animated.View
                pointerEvents={this.state.opened ? 'auto' : 'none'}
                style={[
                    styles.containerModal,
                    {
                        opacity: this.state.animOpacity.interpolate(inter)
                    }
                ]}
            >
                <GLText style={styles.title} title={this.props.title} />
                {this.props.children}
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    containerModal: {
        width: '100%',
        height: '50%',

        position: 'absolute',
        left: 0,
        bottom: 0
    },
    title: {
        textAlign: 'center',
        color: '#55AFF0',
        fontSize: 30,
        paddingTop: 12,
        paddingBottom: 6,
        backgroundColor: '#000020',

        borderTopWidth: 2,
        borderTopColor: '#F2F4F4',
        borderBottomWidth: 2,
        borderBottomColor: '#F2F4F4',
    }
});

export default GLBottomModal;