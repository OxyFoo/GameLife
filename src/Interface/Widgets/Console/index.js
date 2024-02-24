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
        if (type === 'warn') color = 'warning';
        else if (type === 'error') color = 'error';

        return (
            <Text style={styles.text} color={color}>{content}</Text>
        );
    }

    render() {
        if (!this.state.enabled) return null;

        const { opened, animation, animationDeleteButtons, debug } = this.state;

        const interY = { inputRange: [0, 1], outputRange: [-256, 0] };
        const translateY = { transform: [{ translateY: animation.interpolate(interY) }] };
        const buttonDelete = {
            opacity: animation,
            transform: [
                { translateY: Animated.multiply(-72, animationDeleteButtons) }
            ]
        };
        const buttonRefreshData = {
            opacity: animation,
            transform: [
                { translateY: Animated.multiply(-116, animationDeleteButtons) }
            ]
        };
        const buttonBenchMark = {
            opacity: animation,
            transform: [
                { translateY: Animated.multiply(-160, animationDeleteButtons) }
            ]
        };

        return (
            <Animated.View style={[styles.console, translateY]} pointerEvents={'box-none'}>
                <View style={styles.content}>
                    <FlatList
                        ref={this.refDebug}
                        data={debug}
                        renderItem={this.renderText}
                        keyExtractor={(item, index) => 'debug-' + index}
                    />
                </View>

                <Button
                    style={styles.buttonOpen}
                    fontSize={14}
                    color='main1'
                    onPress={this.open}
                    onLongPress={this.Disable}
                >
                    Open console
                </Button>

                <Button
                    style={styles.buttonAbsolute}
                    styleAnimation={buttonBenchMark}
                    fontSize={14}
                    color='main1'
                    onPress={this.goToBenchMark}
                    pointerEvents={opened ? undefined : 'none'}
                >
                    BenchMark
                </Button>

                <Button
                    style={styles.buttonAbsolute}
                    styleAnimation={buttonRefreshData}
                    fontSize={14}
                    color='main1'
                    onPress={this.refreshInternalData}
                    pointerEvents={opened ? undefined : 'none'}
                >
                    Refresh internal data
                </Button>

                <Button
                    style={styles.buttonAbsolute}
                    styleAnimation={buttonDelete}
                    fontSize={14}
                    color='main1'
                    onPress={this.deleteAll}
                    pointerEvents={opened ? undefined : 'none'}
                >
                    Remove all data
                </Button>

                <Button
                    style={styles.buttonClose}
                    styleAnimation={{ opacity: animation }}
                    color='main2'
                    onPress={this.close}
                    onLongPress={this.toggleDeleteButtons}
                    pointerEvents={opened ? undefined : 'none'}
                >
                    Close console
                </Button>
            </Animated.View>
        );
    }
}

export default Console;
