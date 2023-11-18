import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Config from 'react-native-config';

import BackLoading from './back';

import { GLLoading, Page, Text } from 'Interface/Components';

class Loading extends BackLoading {
    renderVersions() {
        if (!Config?.ENV || Config.ENV === 'prod') {
            return null;
        }

        return (
            <Text style={styles.version}>
                {Config.ENV.toUpperCase() + ' MODE'}
            </Text>
        );
    }

    render() {
        return (
            <Page ref={ref => this.refPage = ref} scrollable={false}>
                <View style={styles.content} onTouchStart={this.onToucheStart} onTouchEnd={this.onToucheEnd}>
                    <GLLoading state={this.state.icon} />
                </View>
                {this.renderVersions()}
                <Text>{this.state.displayedSentence}</Text>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    version: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        textAlign: 'center'
    }
});

export default Loading;