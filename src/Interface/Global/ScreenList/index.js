import * as React from 'react';
import { View, Animated, TouchableHighlight, FlatList } from 'react-native';

import styles from './style';
import ScreenListBack from './back';
import themeManager from 'Managers/ThemeManager';

import { DynamicBackground } from 'Interface/Primitives';
import { Separator, Text } from 'Interface/Components';

/**
 * @typedef {import('./back').ScreenListItem} ScreenListItem
 */

class ScreenList extends ScreenListBack {
    render() {
        const { opened, anim, label, data } = this.state;
        const opacity = { opacity: anim };
        const event = opened ? 'auto' : 'none';
        const stylePosition = { transform: [{ translateY: this.state.positionY }] };
        const styleBackground = { backgroundColor: themeManager.GetColor('ground1') };

        return (
            <Animated.View
                style={[styles.parent, opacity]}
                pointerEvents={event}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
            >
                <View style={styles.background} />

                <Animated.View style={[styles.panel, styleBackground, stylePosition]} onLayout={this.onLayoutPanel}>
                    <DynamicBackground opacity={0.12} />

                    {/** Background at bottom to hide space */}
                    <View style={[styles.background2, styleBackground]} />

                    <Text style={styles.label}>{label}</Text>

                    <Separator style={styles.separator} />

                    <FlatList
                        ref={this.refFlatlist}
                        data={data}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => `SL-${item?.id}-${item?.value}`}
                        onLayout={this.onLayoutFlatList}
                        onContentSizeChange={this.onContentSizeChange}
                        initialNumToRender={data.length / 2}
                        scrollEnabled={false}
                    />
                </Animated.View>
            </Animated.View>
        );
    }

    /**
     * @param {{ item: ScreenListItem }} param0
     * @returns
     */
    renderItem = ({ item }) => {
        const { id, value } = item;
        const onPress = () => {
            this.callback(id);
            this.Close();
        };
        return (
            <TouchableHighlight
                style={styles.item}
                onPress={onPress}
                underlayColor={themeManager.GetColor('backgroundTransparent')}
            >
                <Text>{value}</Text>
            </TouchableHighlight>
        );
    };
}

export { ScreenList };
