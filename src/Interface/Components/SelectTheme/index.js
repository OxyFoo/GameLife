import { FlatList, Pressable, View } from 'react-native'

import { Icon, Text } from 'Interface/Components'

import themeManager from 'Managers/ThemeManager'
import langManager from 'Managers/LangManager'

/**
 * @param {{ onSelect: (args: string) => any }} params
 */
const SelectTheme = ({
    onSelect,
}) => {
    const lang = {
        ...langManager.curr['settings'],
        ...langManager.curr['theme-variants'],
    }

    const variants = themeManager.variantsKeys.map((variantName) => ({
        value: `[${variantName}]`,
        key: variantName,
    }));

    /**
    * @param {{ item: { value: string; key: string; } }} params
    */
    const RenderItem = ({ item }) => {
        const isSelected = item.key === themeManager.selectedThemeVariant;

        const backgroundColor = isSelected
            ? themeManager.GetColor('main1', { luminance: 0.6 })
            : 'transparent';
            
        const textColor = isSelected
            ? themeManager.GetColor('main1', { luminance: 1.2 })
            : 'white';

        return (
            <Pressable onPress={() => onSelect(item.key)}>
                <View style={{
                    backgroundColor,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                    paddingVertical: 12,
                }}>
                    <Text style={{
                        color: textColor,
                        fontWeight: isSelected ? '700' : 'normal',
                    }}>
                        {
                            // @ts-ignore
                            lang[item.key] ?? item.key
                        }
                    </Text>

                    {isSelected && (
                        <Icon
                            icon='check-filled'
                            color={themeManager.GetColor('main1', { luminance: 1.2 })}
                        />
                    )}
                </View>
            </Pressable>
        );
    };

    return (
        <FlatList
            style={{
                display: 'flex',
                alignContent: 'flex-start',
                backgroundColor: themeManager.GetColor('main1', { luminance: 0.5 }),
                borderWidth: 2,
                borderColor: themeManager.GetColor('main1', { luminance: 1.2 }),
                borderRadius: 8,
            }}
            data={variants}
            renderItem={({ item }) => <RenderItem item={item} />}
            keyExtractor={(item) => item.key}
        />
    );
};

export default SelectTheme;
