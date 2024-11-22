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
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
                pointerEvents={event}
            >
                <View
                    style={styles.background}
                    onTouchStart={this.onBackgroundTouchStart}
                    onTouchMove={this.onBackgroundTouchMove}
                    onTouchEnd={this.onBackgroundTouchEnd}
                />

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
                        initialNumToRender={10}
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

        return (
            <TouchableHighlight
                style={styles.item}
                onPress={() => this.onPressItem(id)}
                underlayColor={themeManager.GetColor('backgroundTransparent')}
            >
                <Text>{value}</Text>
            </TouchableHighlight>
        );
    };
}

export { ScreenList };
