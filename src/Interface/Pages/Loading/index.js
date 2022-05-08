import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackLoading from './back';

import { GLLoading } from '../../Components';

class Loading extends BackLoading {
    render() {
        return (
            <View style={styles.content} onTouchStart={this.onToucheStart} onTouchEnd={this.onToucheEnd}>
                <GLLoading state={this.state.icon} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Loading;