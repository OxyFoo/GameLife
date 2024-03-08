import React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import { RenderItemMemo } from './element';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import NONZERODAYS_REWARDS from 'Ressources/items/quests/NonZeroDay';
import { Button, Text } from 'Interface/Components';
import { GetDate } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';

function RenderPopup(props) {
    const lang = langManager.curr['nonzerodays'];
    const stylePopup = {
        backgroundColor: themeManager.GetColor('background')
    };

    const claimsList = user.quests.nonzerodays.claimsList.Get();
    const [ claimIndex, setClaimIndex ] = React.useState(user.quests.nonzerodays.GetCurrentClaimIndex());
    const [ claimCount, setClaimCount ] = React.useState(0);

    let timeout;
    React.useEffect(() => {
        const listener = user.quests.nonzerodays.claimsList.AddListener((claimsList) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                setClaimIndex(user.quests.nonzerodays.GetCurrentClaimIndex());
            }, 1000);
        });

        return () => {
            user.quests.nonzerodays.claimsList.RemoveListener(listener);
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
        isCurrentStreak = user.quests.nonzerodays.IsCurrentList(currentClaimList);
        if (!isCurrentStreak) {
            claimDate = DateToFormatString(GetDate(currentClaimList.start));
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
                    {lang['container-date'].replace('{}', claimDate)}
                </Text>
            )}

            <FlatList
                data={NONZERODAYS_REWARDS}
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
                        onPress={user.quests.nonzerodays.ClaimAll}
                    >
                        {lang['claim-all']}
                    </Button>
                </View>
            )}
        </View>
    );
}

export default RenderPopup;
