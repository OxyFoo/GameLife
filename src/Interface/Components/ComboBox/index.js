import * as React from 'react';
import { View, Animated, TouchableHighlight, FlatList, Platform } from 'react-native';

import styles from './style';
import ComboBoxBack from './back';
import themeManager from 'Managers/ThemeManager';
import langManager from 'Managers/LangManager';

import { Text } from '../Text';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { InputText } from '../InputText';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('./back').ComboBoxItem} ComboBoxItem
 */

class ComboBox extends ComboBoxBack {
    render() {
        return (
            <>
                {this.renderElement()}
                {this.renderOverlay()}
                {this.renderContent()}
            </>
        );
    }

    renderElement = () => {
        const { style, title, activeColor, enabled, selectedValue } = this.props;
        const { anim, selectionMode } = this.state;

        const angle = anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        });

        return (
            <View style={[styles.parentContent, style]} onLayout={this.onLayout}>
                {/* Button for interaction (open combobox) */}
                <Button
                    testID='combobox-button'
                    style={styles.hoverButton}
                    appearance='transparent'
                    onPress={this.onPress}
                    onLongPress={this.resetSelection}
                    onTouchMove={this.closeSelection}
                />

                {/* InputText to show result */}
                <InputText
                    containerStyle={styles.input}
                    label={title}
                    value={selectedValue}
                    activeColor={activeColor}
                    forceActive={selectionMode}
                    pointerEvents='none'
                />

                {/* Chevron icon */}
                {enabled && (
                    <View style={styles.chevron} pointerEvents='none'>
                        <Animated.View style={{ transform: [{ rotateX: angle }] }}>
                            <Icon
                                icon='chevron'
                                color={selectionMode ? activeColor : 'border'}
                                size={20}
                                angle={-90}
                            />
                        </Animated.View>
                    </View>
                )}
            </View>
        );
    }

    renderOverlay = () => {
        const { selectionMode } = this.state;

        if (!selectionMode) {
            return null;
        }

        return (
            <View
                style={styles.overlayBackground}
                onTouchStart={this.closeSelection}
            />
        );
    }

    renderContent = () => {
        const { enableSearchBar: setSearchBar, maxContentHeight: maxHeight, activeColor } = this.props;
        const { anim, data, selectionMode } = this.state;
        const { x, y, width, height } = this.state.parent;

        const animValue = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [-60, 0]
        });

        /** @type {StyleProp} */
        const overlayStyle = {
            width: width,
            maxHeight: maxHeight,
            transform: [
                { translateX: x },
                { translateY: y + height }
            ]
        };

        /** @type {StyleProp} */
        const borderFixStyle = {
            opacity: anim,
            transform: [
                { translateX: x },
                { translateY: y + height }
            ],
            borderColor: themeManager.GetColor(activeColor)
        };

        /** @type {StyleProp} */
        const panelStyle = {
            opacity: anim,
            transform: [{ translateY: animValue }],
            borderColor: themeManager.GetColor(activeColor)
        };

        return (
            <>
                <Animated.View
                    style={[styles.borderFix, borderFixStyle]}
                    pointerEvents={'none'}
                />

                <Animated.View
                    style={[styles.overlayParent, overlayStyle]}
                    pointerEvents={selectionMode ? 'auto' : 'none'}
                >
                    <Animated.View style={[styles.overlayPanel, panelStyle]}>
                        <FlatList
                            ref={this.flatlistRef}
                            ListHeaderComponent={!setSearchBar ? null : (
                                <View style={styles.parentSearchBar}>
                                    <InputText
                                        style={styles.search}
                                        containerStyle={styles.searchContainer}
                                        label={langManager.curr['modal']['search']}
                                        value={this.state.search}
                                        onChangeText={this.refreshSearch}
                                    />
                                </View>
                            )}
                            style={[
                                styles.overlayContent,
                                { backgroundColor: themeManager.GetColor('backgroundGrey') }
                            ]}
                            data={data}
                            renderItem={this.renderItem}
                            onTouchMove={(e) => e.stopPropagation()}
                            keyExtractor={(item, index) => 'i-' + index}

                            onTouchStart={this.DisablePageScroll}
                            onTouchEnd={this.EnablePageScroll}
                            onMomentumScrollEnd={this.EnablePageScroll}
                            onScrollEndDrag={this.EnablePageScroll}
                            nestedScrollEnabled={Platform.OS === 'ios'}
                        />
                    </Animated.View>
                </Animated.View>
            </>
        );
    }

    /** @param {{ item: ComboBoxItem }} param0 */
    renderItem = ({ item }) => {
        const backgroundColor = themeManager.GetColor('backgroundTransparent');

        return (
            <TouchableHighlight
                style={styles.item}
                onPress={() => this.onItemPress(item)}
                underlayColor={backgroundColor}
            >
                <Text style={styles.itemText}>{item.value}</Text>
            </TouchableHighlight>
        );
    }
}

export { ComboBox };
