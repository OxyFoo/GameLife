import React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import { RenderItemMemo } from './element';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import DAILY_QUEST_REWARDS from 'Ressources/items/quests/DailyQuest';
import { Button, Text } from 'Interface/Components';
import { DateToFormatString } from 'Utils/Date';

function RenderPopup(props) {
    const lang = langManager.curr['daily-quest'];
    const stylePopup = {
        backgroundColor: themeManager.GetColor('background')
    };

    const claimsList = user.quests.dailyquest.claimsList.Get();
    const [ claimIndex, setClaimIndex ] = React.useState(user.quests.dailyquest.GetCurrentClaimIndex());
    const [ claimCount, setClaimCount ] = React.useState(0);

    let timeout;
    React.useEffect(() => {
        const listener = user.quests.dailyquest.claimsList.AddListener((claimsList) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                setClaimIndex(user.quests.dailyquest.GetCurrentClaimIndex());
            }, 1000);
        });

        return () => {
            user.quests.dailyquest.claimsList.RemoveListener(listener);
        }
    }, []);

    React.useEffect(() => {
        if (claimIndex !== -1) {
            const claimTotal = claimsList[claimIndex].daysCount;
            const claimedCount = claimsList[claimIndex].claimed.length;
            setClaimCount(claimTotal - claimedCount);
        }
    }, [ claimIndex ]);

    let claimDate = null;
    let isCurrentStreak = false;
    if (claimsList.length > 0) {
        const currentClaimList = claimsList[claimIndex];
        isCurrentStreak = user.quests.dailyquest.IsCurrentList(currentClaimList);
        if (!isCurrentStreak) {
            claimDate = DateToFormatString(new Date(currentClaimList.start + 'T00:00:00'));
        }
    }

    return (
        <View style={[styles.popup, stylePopup]}>
            <LinearGradient
                style={styles.popupTitleContainer}
                colors={[ '#384065', '#B83EFFE3' ]}
                start={{ x: 0, y: -2 }}
                end={{ x: 1, y: 2 }}
            >
                <Text style={styles.popupTitle}>
                    {lang['container-title']}
                </Text>
            </LinearGradient>

            {claimIndex !== -1 && !isCurrentStreak && (
                <Text style={styles.popupText}>
                    {lang['popup']['list-date'].replace('{}', claimDate)}
                </Text>
            )}

            <FlatList
                data={DAILY_QUEST_REWARDS}
                keyExtractor={(item, index) => index.toString()}
                initialNumToRender={10}
                renderItem={(props) => (
                    <RenderItemMemo
                        index={props.index}
                        claimIndex={claimIndex}
                    />
                )}
                ListHeaderComponent={() => (
                    <View style={styles.separatorFirst} />
                )}
                ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                )}
                getItemLayout={(data, index) => (
                    { length: 68, offset: 68 * index, index }
                )}
                showsVerticalScrollIndicator={false}
            />

            {claimCount > 3 && (
                <View style={styles.claimAllView}>
                    <Button
                        style={styles.claimAllButton}
                        color='background'
                        rippleColor='white'
                        onPress={user.quests.dailyquest.ClaimAll}
                    >
                        {lang['popup']['claim-all']}
                    </Button>
                </View>
            )}
        </View>
    );
}

export default RenderPopup;
