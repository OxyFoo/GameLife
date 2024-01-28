import * as React from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

import BackDisplay from './back';

import { Page, Text, Icon, Button } from 'Interface/Components';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Display extends BackDisplay {
    render() {
        return (
            <Page ref={ref => this.refPage = ref} style={styles.page} canScrollOver>
                <Animated.View style={{ transform: [{ scale: this.state.anim }] }}>
                    <Icon
                        icon={this.icon}
                        size={SCREEN_WIDTH * this.iconRatio}
                    />
                </Animated.View>
                <Text>{this.text}</Text>
                <Button style={styles.button} color='main1' onPress={this.callback}>{this.button}</Button>
                {this.quote !== null && (
                    <View style={styles.quoteContainer}>
                        <Text fontSize={16} color={'light'} style={[styles.quote]}>{this.quote}</Text>
                    </View>
                )}
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        paddingTop: '20%',
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    button: {
        width: '80%'
    },
    quoteContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    quote: {
        margin: 0,
        padding: 0,
        fontStyle: 'italic'
    }
});

export default Display;
