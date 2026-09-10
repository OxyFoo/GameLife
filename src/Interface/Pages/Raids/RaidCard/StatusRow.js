import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import { HealAdButton } from './HealAdButton';
import { STOP_CARD_PRESS } from './cardPress';

import { Button, Icon, ProgressBar, Text } from 'Interface/Components';
import { FormatMinutes } from 'Utils/Raids';

/**
 * @typedef {import('Data/User/Raids').RaidSnapshot} RaidSnapshot
 */

/**
 * Current phase of the participant: fight (budget left), heal (countdown and boosts), boss defeated
 * @param {object} props
 * @param {RaidSnapshot} props.snapshot
 */
function StatusRow({ snapshot }) {
    const lang = langManager.curr['raids'];
    const { status, simulation, now, healRemaining, healPrice } = snapshot;

    if (status === 'defeated') {
        return (
            <View style={styles.statusRow}>
                <View style={styles.statusHeader}>
                    <Icon icon='cup' size={18} color='raid' />
                    <Text fontSize={14} color='raid' bold>
                        {lang['status-defeated']}
                    </Text>
                </View>
            </View>
        );
    }

    if (status === 'healing' && simulation !== null) {
        const { start, end } = simulation.current;
        const total = Math.max(1, (end ?? now) - start);
        const elapsed = Math.max(0, total - healRemaining);

        return (
            <View style={styles.statusRow}>
                <View style={styles.statusHealing}>
                    <View style={styles.statusHealingText}>
                        <View style={styles.statusHeader}>
                            <Icon icon='favorite' size={18} color='success' />
                            <Text fontSize={14} color='success' bold>
                                {lang['status-healing']}
                            </Text>
                            <Text fontSize={11} color='light'>
                                {`${FormatMinutes(elapsed / 60)} / ${FormatMinutes(total / 60)}`}
                            </Text>
                        </View>
                        <ProgressBar
                            style={styles.statusBar}
                            height={6}
                            color='success'
                            value={elapsed}
                            maxValue={total}
                        />
                    </View>
                    {user.server2.IsAuthenticated() && (
                        <View style={styles.healButtons}>
                            <HealAdButton />
                            <Button
                                {...STOP_CARD_PRESS}
                                style={styles.healButton}
                                styleContent={styles.healButtonContent}
                                appearance='uniform'
                                color='success'
                                onPress={() => user.raids.HealByOx()}
                            >
                                <Text fontSize={12} color='white' bold>
                                    {lang['heal-ox'].replace('{}', healPrice.toString())}
                                </Text>
                            </Button>
                        </View>
                    )}
                </View>
            </View>
        );
    }

    const budgetTotal = simulation?.current.budgetTotal ?? 0;
    const budgetUsed = simulation?.current.budgetUsed ?? 0;
    const hits = simulation?.totals.hits ?? 0;

    return (
        <View style={styles.statusRow}>
            <View style={styles.statusHeader}>
                <Icon icon='swords' size={18} color='main3' />
                <Text fontSize={14} color='main3' bold>
                    {lang['status-fighting']}
                </Text>
                <Text style={styles.statusDetail} fontSize={11} color='light'>
                    {lang['status-fighting-detail']
                        .replace('{}', hits.toString())
                        .replace('{}', FormatMinutes(Math.max(0, budgetTotal - budgetUsed)))}
                </Text>
            </View>
            <ProgressBar
                style={styles.statusBar}
                height={6}
                color='main3'
                value={budgetUsed}
                maxValue={Math.max(1, budgetTotal)}
            />
        </View>
    );
}

export { StatusRow };
