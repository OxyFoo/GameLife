import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, ProgressBar } from 'Interface/Components';
import { Round } from 'Utils/Functions';

function Experience() {
    const [experience, setExperience] = React.useState(user.experience.experience.Get());

    React.useEffect(() => {
        const listener = user.experience.experience.AddListener((exp) => {
            setExperience(exp);
        });
        return () => {
            user.experience.experience.RemoveListener(listener);
        };
    }, []);

    const { xpInfo } = experience;
    const currentLevel = xpInfo.lvl.toString();
    const currentXP = Round(xpInfo.xp, 0).toString();
    const nextLevelXP = xpInfo.next.toString();

    return (
        <>
            <ProgressBar style={styles.progressbar} height={8} color='main1' value={xpInfo.xp} maxValue={xpInfo.next} />
            <View style={styles.XPHeader}>
                <Text style={styles.level}>{langManager.curr['level']['level-small'] + '. ' + currentLevel}</Text>
                <Text style={styles.experience}>
                    {currentXP + '/' + nextLevelXP + ' ' + langManager.curr['level']['xp']}
                </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    progressbar: {
        marginBottom: 6
    },
    XPHeader: {
        marginTop: 0,
        marginBottom: 0,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    level: {
        fontSize: 12,
        fontWeight: '600'
    },
    experience: {
        fontSize: 12
    }
});

export default Experience;
