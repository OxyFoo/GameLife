import * as React from 'react';
import { ScrollView, View } from 'react-native';

import BackActivityPage2 from './back';
import styles from './style';

import { Text, Button, Icon, InputText } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('../types').ItemSkill} ItemSkill
 * @typedef {import('../types').ItemCategory} ItemCategory
 */

class AddActivityPage2 extends BackActivityPage2 {
    render() {
        return (
            <View style={styles.parent}>
                <Button style={styles.headerButton} appearance='outline' fontColor='primary' borderColor='main1'>
                    <Icon icon='graph' />
                    <Text style={styles.headerButtonText}>[Bien être] - [Boxe]</Text>
                </Button>
                <View style={styles.headerStats}>
                    <Text fontSize={14} color='main1'>{`+ 100 XP /`}</Text>
                    <Text fontSize={14} color='main1'>{` + [1] Social`}</Text>
                    <Text fontSize={14} color='main1'>{` + [2] Force`}</Text>
                    <Text fontSize={14} color='main1'>{` + [2] Endurance`}</Text>
                    <Text fontSize={14} color='main1'>{` + [2] Agilité`}</Text>
                </View>

                <ScrollView>
                    {/* Add now */}
                    <Text style={styles.title}>[Maintenant]</Text>
                    <Button style={styles.addNowButton} fontColor='backgroundCard' borderColor='border'>
                        [Démarrer l'activité maintenant]
                    </Button>

                    {/* Separator */}
                    <View style={styles.separator}>
                        <View style={styles.separatorBar} />
                        <Text style={styles.separatorText}>OU</Text>
                        <View style={styles.separatorBar} />
                    </View>

                    {/* Add later or already done */}
                    <Text style={styles.title}>[Ajouter]</Text>

                    {/* Button: Select day */}
                    <Button style={styles.plannerButton} appearance='outline' fontColor='primary' borderColor='border'>
                        <Text style={styles.plannerButtonText}>[dd / mm / yyyy]</Text>
                        <Icon icon='planner-outline' />
                    </Button>

                    <View style={styles.starttimeContent}>
                        {/* Input: Start time */}
                        <Button
                            style={styles.starttimeButtonLeft}
                            appearance='outline'
                            fontColor='primary'
                            borderColor='border'
                        >
                            <Text style={styles.starttimeButtonText}>[HH : MM]</Text>
                            <Icon icon='clock-outline' />
                        </Button>

                        {/* Input: Duration */}
                        <Button
                            style={styles.starttimeButtonRight}
                            appearance='outline'
                            fontColor='primary'
                            borderColor='border'
                        >
                            <Text style={styles.starttimeButtonText}>[HH h MM m]</Text>
                            <Icon icon='clock-outline' />
                        </Button>
                    </View>

                    {/* Input: Comment */}
                    <InputText
                        style={styles.commentInputText}
                        containerStyle={styles.commentInputTextContainer}
                        label='[Commentaire]'
                        inactiveColor='border'
                        numberOfLines={4}
                        multiline
                    />

                    {/* Button: Add to planner */}
                    <Button style={styles.addActivityButton} fontColor='backgroundCard' borderColor='border'>
                        [Ajouter l'activité]
                    </Button>
                </ScrollView>
            </View>
        );
    }
}

export { AddActivityPage2 };
