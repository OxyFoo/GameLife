import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ProgressBar, Text } from 'Interface/Components';
import langManager from 'Managers/LangManager';

/**
 * Level progress section with XP bar
 * @param {object} props
 * @param {number} props.level - Current level
 * @param {number} props.xpGained - XP gained today
 * @param {number} props.xpCurrent - Current XP in level
 * @param {number} props.xpNext - XP needed for next level
 */
const LevelProgress = ({ level, xpGained, xpCurrent, xpNext }) => {
    const lang = langManager.curr['level'];
    return (
        <View style={styles.levelContainer}>
            <View style={styles.levelRow}>
                <Text style={styles.levelText} color='secondary'>
                    {lang['level-small']} {level}
                </Text>
                <Text style={styles.xpText} color='main1'>
                    + {xpGained} {lang['xp']}
                </Text>
            </View>
            <ProgressBar style={styles.progressBar} value={xpCurrent} maxValue={xpNext} color='gradient' height={8} />
        </View>
    );
};

const styles = StyleSheet.create({
    levelContainer: {
        width: '100%',
        marginBottom: 16
    },
    levelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    levelText: {
        fontSize: 14
    },
    xpText: {
        fontSize: 14,
        fontWeight: '600'
    },
    progressBar: {
        borderRadius: 4
    }
});

export default LevelProgress;
