import { FlatList, TouchableOpacity, View } from 'react-native'

import styles from './style'
import BackSettingsTheme from './back'
import langManager from 'Managers/LangManager'

import { Text, ComboBox } from 'Interface/Components'
import { PageHeader } from 'Interface/Widgets'

import ThemeManager, { themeManager } from 'Managers/ThemeManager'

export default class SettingsTheme extends BackSettingsTheme {
    render() {
        const { themeVariant } = this.state;

        const lang = langManager.curr['settings'];

        const variants = ThemeManager.variantsKeys.map((variantName) => ({
            value: `[${variantName}]`,
            key: variantName,
        }));

        return (
            <View style={styles.page}>
                <PageHeader
                    title={lang['input-theme']}
                    onBackPress={this.onBack}
                    isBeta={true}
                />

                <FlatList
                    data={variants}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => this.onSelectVariantTheme(item.key)}>
                            <Text style={{ color: item.key === themeVariant ? 'red' : 'white' }}>{item.key}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.key}
                />
            </View>
        );
    };
}

/* <View ref={this.refParent} style={[styles.parentContent, style]}>
<Button
    testID='combobox-button'
    style={styles.hoverButton}
    appearance='uniform'
    color='transparent'
    onPress={this.onPress}
    onLongPress={this.resetSelection}
    onTouchMove={this.closeSelection}
/>

<InputText
    style={inputStyle}
    label={title}
    value={selectedValue}
    activeColor={activeColor}
    forceActive={selectionMode}
    pointerEvents='none'
/>

{enabled && !hideChevron && (
    <View style={styles.chevron} pointerEvents='none'>
        <Animated.View style={{ transform: [{ rotateX: angle }] }}>
            <Icon icon='chevron' color={selectionMode ? activeColor : 'border'} size={20} angle={-90} />
        </Animated.View>
    </View>
)} */