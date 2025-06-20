import { Component } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { Icon, Text } from 'Interface/Components';

import themeManager from 'Managers/ThemeManager';
import langManager from 'Managers/LangManager';

import styles from './style';

/**
 * @typedef {import('Managers/ThemeManager').ThemeVariantAllKeys} ThemeVariantAllKeys
 */

class SelectTheme extends Component {
    /**
     * @typedef {(variantName: string) => any} onSelectCallback
     *
     * @typedef {object} Props
     * @property {onSelectCallback} onSelect
     *
     * @param {Props} props
     */
    constructor(props) {
        super(props);

        this.lang = {
            ...langManager.curr['settings'],
            ...langManager.curr['theme-variants']
        };
    }

    /**
     * @typedef {object} ItemData
     * @property {ThemeVariantAllKeys} key
     * @property {string} value
     *
     * @typedef {(variantName: string) => any} onPressCallback
     *
     * @param {{ item: ItemData, onPress: onPressCallback }} props
     */
    RenderItem = ({ item, onPress }) => {
        const isSelected = item.key === themeManager.selectedThemeVariant;
        const backgroundColor = isSelected ? themeManager.GetColor('main1', { luminance: 0.6 }) : 'transparent';
        const textColor = isSelected ? themeManager.GetColor('main1', { luminance: 1.2 }) : 'white';

        return (
            <Pressable onPress={() => onPress(item.key)}>
                <View style={styles.itemContainer(backgroundColor)}>
                    <Text style={styles.itemText(textColor, isSelected)}>{this.lang[item.key] ?? item.key}</Text>

                    {isSelected && (
                        <Icon icon='check-filled' color={themeManager.GetColor('main1', { luminance: 1.2 })} />
                    )}
                </View>
            </Pressable>
        );
    };

    render() {
        const variants = themeManager.variantsKeys.map((variantName) => ({
            value: `[${variantName}]`,
            key: variantName
        }));

        return (
            <FlatList
                style={styles.list(
                    themeManager.GetColor('main1', { luminance: 1.2 }),
                    themeManager.GetColor('main1', { luminance: 0.5 })
                )}
                data={variants}
                renderItem={({ item }) => (
                    <this.RenderItem item={item} onPress={(variantName) => this.props.onSelect(variantName)} />
                )}
                keyExtractor={(item) => item.key}
            />
        );
    }
}

export default SelectTheme;
