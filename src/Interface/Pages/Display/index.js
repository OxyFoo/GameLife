import * as React from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

import BackDisplay from './back';

import { Page, Text, Icon, Button } from 'Interface/Components';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Display extends BackDisplay {
    render() {
        return (
            <Page ref={ref => this.refPage = ref} style={styles.page} canScrollOver>
                <Animated.View style={{ transform: [{ scale: this.state.anim }] }}>
                    <Icon icon={this.icon} size={SCREEN_WIDTH * .8} />
                </Animated.View>
                <Text>{this.text}</Text>
                <Button style={styles.button} color='main1' onPress={this.callback}>{this.button}</Button>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        paddingTop: '30%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    button: {
        width: '80%',
        marginBottom: 48
    }
});

export default Display;