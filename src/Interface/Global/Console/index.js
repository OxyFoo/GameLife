import * as React from 'react';
import { View, Animated, FlatList } from 'react-native';

import styles from './style';
import ConsoleBack from './back';

import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('./back').ConsoleLine} ConsoleLine
 * @typedef {import('react-native').ListRenderItem<ConsoleLine>} ListRenderItem
 */

class Console extends ConsoleBack {
    /** @type {ListRenderItem} */
    renderText = ({ item }) => {
        const { type, content } = item;

        /** @type {ThemeText} */
        let color = 'primary';
        if (type === 'warn') {
            color = 'warning';
        } else if (type === 'error') {
            color = 'error';
        }

        return (
            <Text style={styles.text} color={color}>
                {content}
            </Text>
        );
    };

    render() {
        if (!this.state.enabled) {
            return null;
        }

        const { opened, animation, animationDeleteButtons, debug } = this.state;

        const interY = { inputRange: [0, 1], outputRange: [-256, 0] };
        const translateY = {
            transform: [{ translateY: animation.interpolate(interY) }]
        };
        const buttonFirstRow = {
            opacity: animation,
            transform: [{ translateY: Animated.multiply(-72, animationDeleteButtons) }]
        };
        const buttonSecondRow = {
            opacity: animation,
            transform: [{ translateY: Animated.multiply(-116, animationDeleteButtons) }]
        };

        return (
            <Animated.View style={[styles.console, translateY]} pointerEvents={'box-none'}>
                <View style={styles.content}>
                    <FlatList
                        ref={this.refDebug}
                        data={debug}
                        renderItem={this.renderText}
                        keyExtractor={(item, index) => 'debug-' + item.type + '-' + index}
                    />
                </View>

                <Button
                    style={styles.buttonOpen}
                    fontSize={14}
                    appearance='uniform'
                    color='main1'
                    fontColor='white'
                    onPress={this.open}
                    onLongPress={this.Disable}
                >
                    Open console
                </Button>

                <Animated.View
                    style={[styles.buttonAbsoluteLeft, buttonFirstRow]}
                    pointerEvents={opened ? undefined : 'none'}
                >
                    <Button
                        style={styles.buttonFeature}
                        fontSize={14}
                        appearance='uniform'
                        color='main1'
                        fontColor='white'
                        onPress={this.deleteAll}
                    >
                        Remove all data
                    </Button>

                    <Button
                        style={styles.buttonFeature}
                        fontSize={14}
                        appearance='uniform'
                        color='main1'
                        fontColor='white'
                        onPress={this.goToBenchMark}
                    >
                        BenchMark
                    </Button>
                </Animated.View>

                <Animated.View
                    style={[styles.buttonAbsoluteLeft, buttonSecondRow]}
                    pointerEvents={opened ? undefined : 'none'}
                >
                    <Button
                        style={styles.buttonFeature}
                        fontSize={14}
                        appearance='uniform'
                        color='main1'
                        fontColor='white'
                        onPress={this.refreshInternalData}
                    >
                        Refresh internal data
                    </Button>

                    <Button
                        style={styles.buttonFeature}
                        fontSize={14}
                        appearance='uniform'
                        color='main1'
                        fontColor='white'
                        onPress={this.goToResponsive}
                    >
                        Responsive
                    </Button>
                </Animated.View>

                <Button
                    style={styles.buttonClose}
                    styleAnimation={{ opacity: animation }}
                    appearance='uniform'
                    color='main2'
                    onPress={this.onClosePress}
                    onLongPress={this.toggleDeleteButtons}
                    pointerEvents={opened ? undefined : 'none'}
                >
                    Close console
                </Button>
            </Animated.View>
        );
    }
}

export { Console };
