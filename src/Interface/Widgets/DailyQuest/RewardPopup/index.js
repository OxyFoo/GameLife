import React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import { DailyQuestDayItem } from './element';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Text } from 'Interface/Components';
import { DateFormat } from 'Utils/Date';

/** @param {Object} _props */
function RenderPopup(_props) {
    const lang = langManager.curr['daily-quest'];

    const _init_claimsList = user.dailyQuest.claimsList.Get();
    const _init_index = user.dailyQuest.GetCurrentClaimIndex();

    const [claimList, setClaimList] = React.useState(_init_index === -1 ? null : _init_claimsList[_init_index]);
    const [claimCount, setClaimCount] = React.useState(0);
    const [claimDays, setClaimDays] = React.useState(
        user.dailyQuest.GetClaimDays(_init_index === -1 ? null : _init_claimsList[_init_index])
    );

    React.useEffect(() => {
        const listener = user.dailyQuest.claimsList.AddListener((claimsList) => {
            const index = user.dailyQuest.GetCurrentClaimIndex();
            setClaimList({ ...claimsList[index] });
        });

        return () => {
            user.dailyQuest.claimsList.RemoveListener(listener);
        };
    }, []);

    React.useEffect(() => {
        if (claimList !== null) {
            const claimTotal = claimList.daysCount;
            const claimedCount = claimList.claimed.length;
            setClaimCount(claimTotal - claimedCount);
            setClaimDays(user.dailyQuest.GetClaimDays(claimList));
        }
    }, [claimList]);

    if (claimDays === null) {
        return null;
    }

    let claimDate = null;
    let isCurrentStreak = false;
    if (claimList !== null && _init_claimsList.length > 0) {
        isCurrentStreak = user.dailyQuest.IsCurrentList(claimList);
        if (!isCurrentStreak) {
            claimDate = DateFormat(new Date(claimList.start + 'T00:00:00'), 'DD/MM/YYYY');
        }
    }

    return (
        <View style={styles.popup}>
            <LinearGradient
                style={styles.popupTitleContainer}
                colors={['#384065', '#B83EFFE3']}
                start={{ x: 0, y: -2 }}
                end={{ x: 1, y: 2 }}
            >
                <Text style={styles.popupTitle}>{lang['container-title']}</Text>
            </LinearGradient>

            {claimList !== null && !isCurrentStreak && claimDate !== null && (
                <Text style={styles.popupText}>{lang['popup']['list-date'].replace('{}', claimDate)}</Text>
            )}

            <FlatList
                data={claimDays}
                keyExtractor={(item) => item.index.toString()}
                initialNumToRender={10}
                renderItem={(props) => <DailyQuestDayItem item={props.item} claimList={claimList} />}
                ListHeaderComponent={<View style={styles.separatorFirst} />}
                ItemSeparatorComponent={RenderSeparator}
                getItemLayout={(_data, index) => ({ length: 68, offset: 68 * index, index })}
                showsVerticalScrollIndicator={false}
            />

            {claimCount > 3 && (
                <View style={styles.claimAllView}>
                    <Button style={styles.claimAllButton} onPress={ClaimAll}>
                        {lang['popup']['claim-all']}
                    </Button>
                </View>
            )}
        </View>
    );
}

async function ClaimAll() {
    const lang = langManager.curr['daily-quest'];

    const result = await user.dailyQuest.ClaimAll();

    if (result !== 'success') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-claim-error-title'],
                message: lang['alert-claim-error-message'].replace('{}', result)
            },
            cancelable: false,
            priority: true
        });
    }
}

const RenderSeparator = () => <View style={styles.separator} />;

export default RenderPopup;
