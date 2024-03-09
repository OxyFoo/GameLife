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
                {this.renderButtons()}
                {this.quote !== null && (
                    <View style={styles.quoteContainer}>
                        <Text fontSize={16} color={'light'} style={styles.quote}>{this.quote.text}</Text>
                        <Text fontSize={14} color={'secondary'} style={styles.quote}>{this.quote.author}</Text>
                    </View>
                )}
            </Page>
        );
    }

    renderButtons = () => {
        // Show two buttons if both are defined
        if (!!this.button2 && !!this.callback2) {
            return (
                <View style={styles.doubleButtons}>
                    <Button
                        style={styles.buttonHalf1}
                        color='main1'
                        fontSize={14}
                        onPress={this.callback}
                    >
                        {this.button}
                    </Button>
                    <Button
                        style={styles.buttonHalf2}
                        color='main2'
                        fontSize={14}
                        onPress={this.callback2}
                    >
                        {this.button2}
                    </Button>
                </View>
            );
        }
        return (
            <Button style={styles.button} color='main1' onPress={this.callback}>{this.button}</Button>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        paddingTop: 48,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    doubleButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        width: '80%'
    },
    buttonHalf1: {
        flex: 1,
        marginRight: 6,
        paddingHorizontal: 6
    },
    buttonHalf2: {
        flex: 1,
        marginLeft: 6,
        paddingHorizontal: 6
    },
    quoteContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    quote: {
        fontStyle: 'italic'
    }
});

export default Display;
