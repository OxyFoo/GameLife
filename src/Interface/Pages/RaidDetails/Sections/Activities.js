import * as React from 'react';
import { View } from 'react-native';

import styles from '../style';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';
import { useRaid } from 'Interface/Pages/Raids/RaidCard/useRaid';

import user from 'Managers/UserManager';
import { Button, Icon, Text } from 'Interface/Components';
import { FormatMinutes } from 'Utils/Raids';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidHit} RaidHit
 */

/**
 * @param {object} props
 * @param {RaidHit} props.hit
 * @param {RaidHit | undefined} [props.serverHit] Same activity as the server replayed it (critical known)
 */
function ActivityRow({ hit, serverHit }) {
    const lang = langManager.curr['raids'];
    const skill = dataManager.skills.GetByID(hit.skillID);
    const category = skill === null ? null : dataManager.skills.GetCategoryByID(skill.CategoryID);
    const logoXML = category !== null ? dataManager.skills.GetXmlByLogoID(category.LogoID) : null;
    const name = skill === null ? '?' : langManager.GetText(skill.Name);
    const critical = serverHit?.critical ?? false;
    const points = serverHit?.points ?? hit.points;

    const openSkill = () => {
        if (skill !== null) {
            user.interface.ChangePage('skill', { args: { skillID: skill.ID } });
        }
    };

    return (
        <Button
            style={styles.activityRow}
            styleContent={styles.activityContent}
            appearance='uniform'
            color='transparent'
            enabled={skill !== null}
            onPress={openSkill}
        >
            <View style={styles.activityIcon}>
                <Icon
                    xml={logoXML}
                    size={18}
                    // @ts-ignore The category color is a hex string
                    color={category?.Color ?? 'main1'}
                />
            </View>
            <Text style={styles.activityText} fontSize={14} numberOfLines={1}>
                {`${name} · ${FormatMinutes(hit.minutes)}`}
            </Text>
            <View style={styles.activityPoints}>
                <Text fontSize={13} color='success' bold>
                    {lang['points-signed'].replace('{}', points.toString())}
                </Text>
                {critical && <Icon icon='bolt' size={14} color='raid' />}
            </View>
        </Button>
    );
}

/** Activities counted in the current raid, newest first (local preview, criticals from the server) */
function Activities() {
    const snapshot = useRaid();
    const lang = langManager.curr['raids'];

    const hits = [...(snapshot.simulation?.hits ?? [])].reverse();
    const serverHits = new Map((snapshot.self?.simulation.hits ?? []).map((hit) => [hit.activityID ?? -1, hit]));

    return (
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} color='border'>
                    {lang['activities-title']}
                </Text>
                <View style={[styles.badge, { backgroundColor: themeManager.GetColor('main1', { opacity: 0.2 }) }]}>
                    <Text fontSize={11} color='main1'>
                        {lang['activities-count'].replace('{}', hits.length.toString())}
                    </Text>
                </View>
            </View>

            {hits.length === 0 ? (
                <View style={styles.centered}>
                    <Text color='secondary'>{lang['activities-empty']}</Text>
                </View>
            ) : (
                hits.map((hit) => (
                    <ActivityRow
                        key={`raid-hit-${hit.activityID ?? hit.startTime}`}
                        hit={hit}
                        serverHit={hit.activityID === null ? undefined : serverHits.get(hit.activityID)}
                    />
                ))
            )}
        </View>
    );
}

export { Activities };
