import * as React from 'react';
import { ScrollView, View } from 'react-native';

import styles from './style';
import BackActivityPage2 from './back';
import { AddActivityPage2Add } from './Add';
import { AddActivityPage2StartNow } from './StartNow';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { Text, Button, Icon, KeyboardSpacerView, OxAmount } from 'Interface/Components';
import { Round } from 'Utils/Functions';
import { GetLocalTime } from 'Utils/Time';

class AddActivityPage2 extends BackActivityPage2 {
    render() {
        const { show, activity, editActivity, changeActivity, unSelectActivity } = this.props;
        const { activityText, categoryColor, xmlIcon } = this.state;

        if (!show) {
            return null;
        }

        return (
            <View ref={this.props.nativeRef} style={styles.parent} collapsable={false}>
                <Button
                    style={styles.headerButton}
                    styleContent={styles.headerButtonContent}
                    appearance='outline'
                    fontColor='primary'
                    // @ts-ignore
                    borderColor={categoryColor}
                    onPress={unSelectActivity}
                    onLongPress={this.openSkill}
                >
                    <Icon icon='arrow-left' />
                    <View style={styles.headerButtonActivity}>
                        <Icon
                            // @ts-ignore
                            color={categoryColor}
                            xml={xmlIcon}
                        />
                        <Text style={styles.headerButtonText}>{activityText}</Text>
                    </View>
                    <View />
                </Button>
                <View style={styles.headerStats}>
                    <this.renderStatsText />
                </View>

                <ScrollView
                    ref={user.interface.bottomPanel?.mover.SetScrollView}
                    onLayout={user.interface.bottomPanel?.mover.onLayoutFlatList}
                    onContentSizeChange={user.interface.bottomPanel?.mover.onContentSizeChange}
                    scrollEnabled={false}
                >
                    {editActivity === null && (
                        <>
                            <AddActivityPage2StartNow nativeRef={this.nativeRefStartNowView} activity={activity} />

                            {/* Separator */}
                            <View style={styles.separator}>
                                <View style={styles.separatorBar} />
                                <Text style={styles.separatorText}>OU</Text>
                                <View style={styles.separatorBar} />
                            </View>
                        </>
                    )}

                    <AddActivityPage2Add
                        nativeRef={this.nativeRefAddView}
                        activity={activity}
                        baseActivity={editActivity}
                        changeActivity={changeActivity}
                        unSelectActivity={unSelectActivity}
                    />

                    <KeyboardSpacerView offset={96} />
                </ScrollView>
            </View>
        );
    }

    renderStatsText = () => {
        const lang = langManager.curr['activity'];
        const langXP = langManager.curr['level'];
        const langStats = langManager.curr['statistics']['names'];
        const { activity, editActivity } = this.props;

        const skill = dataManager.skills.GetByID(activity.skillID);
        if (skill === null) {
            return null;
        }

        // The version that will be stored: an edit of the skill, start or duration is re-stamped
        // (the 48h rule applies to it), an addition is stamped with now
        const stamped =
            editActivity === null
                ? { ...activity, addedTime: activity.addedTime || GetLocalTime() }
                : user.activities.StampEdition(editActivity, activity);

        const XP = Round((skill.XP * stamped.duration) / 60, 2);
        if (XP === 0) {
            return (
                <Text fontSize={14} color='main1'>
                    {lang['title-no-experience']}
                </Text>
            );
        }

        // XP not granted
        const activityStatus = user.activities.GetExperienceStatus(stamped);
        if (activityStatus === 'beforeLimit') {
            return (
                <Text fontSize={14} color='main1'>
                    {lang['title-before-limit']}
                </Text>
            );
        } else if (activityStatus === 'isNotPast' && editActivity !== null) {
            return (
                <Text fontSize={14} color='main1'>
                    {lang['title-not-past']}
                </Text>
            );
        }

        // Ox brought by the activity, previewed as if it were done. In edit mode the header keeps
        // showing what the new version is worth; the signed price of the change (penalty included)
        // is on the Edit button, so the two numbers never contradict each other.
        const ox = editActivity === null ? user.activities.GetOxReward(activity) : null;
        if (ox === 0 && activityStatus === 'grant') {
            return (
                <Text fontSize={14} color='main1'>
                    {lang['title-limit-reached']}
                </Text>
            );
        }

        const usefulStats = user.experience.statsKey.filter((key) => skill.Stats[key] > 0);

        // Raid points of a stored activity, the critical hit revealed by the server
        const raidHit = editActivity === null ? null : user.raids.GetHit(editActivity);

        return (
            <>
                <Text fontSize={14} color='main1'>{`+ ${XP} ${langXP['xp']} / `}</Text>
                {ox !== null && <OxAmount value={ox} signed fontSize={14} color='main1' />}
                {ox !== null && (
                    <Text fontSize={14} color='main1'>
                        {' /'}
                    </Text>
                )}
                {usefulStats.map((stat) => {
                    const statXP = Round((skill.Stats[stat] * stamped.duration) / 60, 2);
                    return (
                        <Text
                            key={`stat-text-${stat}`}
                            fontSize={14}
                            color='main1'
                        >{` + ${statXP} ${langStats[stat]}`}</Text>
                    );
                })}
                {raidHit !== null && (
                    <>
                        <Text fontSize={14} color='main1'>
                            {` / + ${langManager.curr['raids']['points'].replace('{}', raidHit.points.toString())}`}
                        </Text>
                        {raidHit.critical && <Icon icon='bolt' size={14} color='raid' />}
                    </>
                )}
            </>
        );
    };
}

export { AddActivityPage2 };
