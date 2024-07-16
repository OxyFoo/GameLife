import * as React from 'react';
import { ScrollView, View } from 'react-native';

import styles from './style';
import BackActivityPage2 from './back';
import { AddActivityPage2Add } from './Add';
import { AddActivityPage2StartNow } from './StartNow';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { Text, Button, Icon } from 'Interface/Components';
import { Round } from 'Utils/Functions';

class AddActivityPage2 extends BackActivityPage2 {
    render() {
        const { activity, editActivity, changeActivity, unSelectActivity } = this.props;

        return (
            <View style={styles.parent}>
                <Button
                    style={styles.headerButton}
                    styleContent={styles.headerButtonContent}
                    appearance='outline'
                    fontColor='primary'
                    borderColor='main1'
                    onPress={unSelectActivity}
                >
                    <Icon icon='arrow-left' />
                    <View style={styles.headerButtonActivity}>
                        <Icon xml={this.xmlIcon} />
                        <Text style={styles.headerButtonText}>{this.activityText}</Text>
                    </View>
                    <View />
                </Button>
                <View style={styles.headerStats}>{this.renderStatsText()}</View>

                <ScrollView>
                    {editActivity === null && (
                        <>
                            <AddActivityPage2StartNow activity={activity} />

                            {/* Separator */}
                            <View style={styles.separator}>
                                <View style={styles.separatorBar} />
                                <Text style={styles.separatorText}>OU</Text>
                                <View style={styles.separatorBar} />
                            </View>
                        </>
                    )}

                    <AddActivityPage2Add
                        activity={activity}
                        editActivity={editActivity}
                        changeActivity={changeActivity}
                        unSelectActivity={unSelectActivity}
                    />
                </ScrollView>
            </View>
        );
    }

    renderStatsText() {
        const lang = langManager.curr['activity'];
        const langXP = langManager.curr['level'];
        const langStats = langManager.curr['statistics']['names'];
        const { activity } = this.props;

        const skill = dataManager.skills.GetByID(activity.skillID);
        if (skill === null) {
            return null;
        }

        // XP not granted
        const activityStatus = user.activities.GetExperienceStatus(activity);
        if (activityStatus === 'beforeLimit') {
            return (
                <Text fontSize={14} color='main1'>
                    {lang['title-no-experience']}
                </Text>
            );
        } else if (activityStatus === 'isNotPast') {
            return (
                <Text fontSize={14} color='main1'>
                    {lang['title-not-past']}
                </Text>
            );
        }

        const XP = Round((skill.XP * activity.duration) / 60, 2);
        const usefulStats = user.statsKey.filter((key) => skill.Stats[key] > 0);

        return (
            <>
                <Text fontSize={14} color='main1'>{`+ ${XP} ${langXP['xp']} /`}</Text>
                {usefulStats.map((stat) => {
                    const statXP = Round((skill.Stats[stat] * activity.duration) / 60, 2);
                    return <Text fontSize={14} color='main1'>{` + ${statXP} ${langStats[stat]}`}</Text>;
                })}
            </>
        );
    }
}

export { AddActivityPage2 };
