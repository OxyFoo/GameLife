import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components';

/** @typedef {import('@oxyfoo/gamelife-types/Global/Rarities').Rarities} Rarities */

/**
 * A rarity in its colour, and the arrow to the next one when the copy is about to step up
 * @param {object} props
 * @param {Rarities} props.from
 * @param {Rarities | null} [props.to]
 * @param {number} [props.fontSize]
 */
function RarityLabel({ from, to = null, fontSize = 11 }) {
    const lang = langManager.curr['rarities'];

    return (
        <View style={styles.rarityRow}>
            <Text style={{ color: themeManager.GetRariryColors(from)[0] }} fontSize={fontSize} bold>
                {lang[from].toUpperCase()}
            </Text>
            {to !== null && (
                <>
                    <Text fontSize={fontSize} color='light'>
                        {' → '}
                    </Text>
                    <Text style={{ color: themeManager.GetRariryColors(to)[0] }} fontSize={fontSize} bold>
                        {lang[to].toUpperCase()}
                    </Text>
                </>
            )}
        </View>
    );
}

export { RarityLabel };
