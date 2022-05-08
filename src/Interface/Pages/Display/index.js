import * as React from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

import BackDisplay from './back';

import { Page, Text, Icon, Button } from '../../Components';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Display extends BackDisplay {
    render() {
        return (
            <Page style={styles.page} canScrollOver={true} bottomOffset={0}>
                <Animated.View style={{ transform: [{ scale: this.state.anim }] }}>
                    <Icon icon={this.icon} size={SCREEN_WIDTH * .8} />
                </Animated.View>
                <Text>{this.text}</Text>
                <Button style={{ width: '80%' }} color='main1' onPress={this.Back}>{this.button}</Button>
            </Page>
        )
    }
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        paddingTop: '30%',
        paddingBottom: '10%',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default Display;