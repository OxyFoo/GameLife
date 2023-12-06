import * as React from 'react';
import { View, Animated, TouchableHighlight, FlatList } from 'react-native';

import styles from './style';
import ComboBoxBack from './back';
import themeManager from 'Managers/ThemeManager';
import langManager from 'Managers/LangManager';

import Text from 'Interface/Components/Text';
import Button from 'Interface/Components/Button';
import Icon from 'Interface/Components/Icon';
import Input from 'Interface/Components/Input';

/**
 * @typedef {import('./back').ComboBoxItem} ComboBoxItem
 */

class ComboBox extends ComboBoxBack {
    renderSearchBar = () => (
        <View style={styles.parentSearchBar}>
            <Input
                label={langManager.curr['modal']['search']}
                text={this.state.search}
                onChangeText={this.refreshSearch}
            />
        </View>
    );

    /** @param {{ item: ComboBoxItem }} param0 */
    renderItem = ({ item }) => {
        const { key, value } = item;
        const backgroundColor = themeManager.GetColor('backgroundTransparent');

        return (
            <TouchableHighlight
                style={styles.item}
                onPress={() => this.onItemPress(item)}
                underlayColor={backgroundColor}
            >
                <Text style={styles.itemText}>{value}</Text>
            </TouchableHighlight>
        );
    }

    renderChevron = () => {
        const angle = this.state.anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

        return this.props.enabled && (
            <View style={styles.chevron} pointerEvents='none'>
                <Animated.View style={{ transform: [{ rotateX: angle }] }}>
                    <Icon icon='chevron' size={20} angle={-90} />
                </Animated.View>
            </View>
        );
    }

    render() {
        const  { x, y, width, height } = this.state.parent;
        const animValue = this.state.anim.interpolate({ inputRange: [0, 1], outputRange: [y+height+20, y+height] });
        const overlayPos = [styles.overlay, {
            width: width,
            maxHeight: this.props.maxHeight,
            opacity: this.state.anim,
            transform: [{ translateX: x }, { translateY: animValue }],
            backgroundColor: themeManager.GetColor('backgroundGrey')
        }];
        const header = this.props.setSearchBar ? this.renderSearchBar : null;

        return (
            <>
                {/* Component (Input for selection, chevron and button for ripple + events) */}
                <View style={[styles.parent, this.props.style]} onLayout={this.onLayout}>
                    <Input
                        label={this.props.title}
                        text={this.state.selectedValue}
                        active={this.state.selectionMode}
                        pointerEvents='none'
                    />

                    <this.renderChevron />

                    <Button
                        testID='combobox-button'
                        style={styles.hoverButton}
                        onPress={this.openSelection}
                        onLongPress={this.resetSelection}
                        rippleColor='white'
                    />
                </View>

                {/* Overlay (black opacity + back event) */}
                {this.state.selectionMode && <View style={styles.overlayBackground} onTouchStart={this.closeSelection} />}

                {/* Content (flatlist with elements) */}
                <Animated.View style={overlayPos} pointerEvents={this.state.selectionMode ? 'auto': 'none'}>
                    <FlatList
                        ref={ref => this.flatlistRef = ref}
                        ListHeaderComponent={header}
                        data={this.state.data}
                        renderItem={this.renderItem}
                        onTouchMove={(e) => e.stopPropagation()}
                        keyExtractor={(item, index) => 'i-' + index}
                    />
                </Animated.View>
            </>
        );
    }
}

export default ComboBox;
