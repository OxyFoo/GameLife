import * as React from 'react';
import { ScrollView, View } from 'react-native';

import BackActivityPage2 from './back';
import styles from './style';

import { Text, Button, Icon } from 'Interface/Components';
import langManager from 'Managers/LangManager';
import { AddActivityPage2StartNow } from './StartNow';
import { AddActivityPage2Add } from './Add';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('../types').ItemSkill} ItemSkill
 * @typedef {import('../types').ItemCategory} ItemCategory
 */

class AddActivityPage2 extends BackActivityPage2 {
    render() {
        //const lang = langManager.curr['activity'];
        const langXP = langManager.curr['level'];
        const langStats = langManager.curr['statistics']['names'];
        const { skillID, unSelectSkill } = this.props;

        return (
            <View style={styles.parent}>
                <Button
                    style={styles.headerButton}
                    styleContent={styles.headerButtonContent}
                    appearance='outline'
                    fontColor='primary'
                    borderColor='main1'
                    onPress={unSelectSkill}
                >
                    <Icon icon='arrow-left' />
                    <View style={styles.headerButtonActivity}>
                        <Icon xml={this.xmlIcon} />
                        <Text style={styles.headerButtonText}>{this.activityText}</Text>
                    </View>
                    <View />
                </Button>
                <View style={styles.headerStats}>
                    <Text fontSize={14} color='main1'>{`+ [100] ${langXP['xp']} /`}</Text>
                    <Text fontSize={14} color='main1'>{` + [1] ${langStats['soc']}`}</Text>
                    <Text fontSize={14} color='main1'>{` + [2] ${langStats['for']}`}</Text>
                    <Text fontSize={14} color='main1'>{` + [2] ${langStats['sta']}`}</Text>
                    <Text fontSize={14} color='main1'>{` + [2] ${langStats['agi']}`}</Text>
                </View>

                <ScrollView>
                    <AddActivityPage2StartNow skillID={skillID} />

                    {/* Separator */}
                    <View style={styles.separator}>
                        <View style={styles.separatorBar} />
                        <Text style={styles.separatorText}>OU</Text>
                        <View style={styles.separatorBar} />
                    </View>

                    <AddActivityPage2Add skillID={skillID} />
                </ScrollView>
            </View>
        );
    }
}

export { AddActivityPage2 };
