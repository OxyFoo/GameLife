import React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import { RenderItemMemo } from './element';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Text } from 'Interface/Components';
import { DateFormat } from 'Utils/Date';

/** @type {NodeJS.Timeout | undefined} */
let timeout;

/** @param {Object} _props */
function RenderPopup(_props) {
    const lang = langManager.curr['daily-quest'];

    const _init_claimsList = user.dailyQuest.claimsList.Get();
    const _init_index = user.dailyQuest.GetCurrentClaimIndex();

    const [claimIndex, setClaimIndex] = React.useState(_init_index);
    const [claimCount, setClaimCount] = React.useState(0);
    const [claimDays, setClaimDays] = React.useState(
        user.dailyQuest.GetClaimDays(_init_index === -1 ? null : _init_claimsList[_init_index])
    );

    React.useEffect(() => {
        const listener = user.dailyQuest.claimsList.AddListener((_claimsList) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setClaimIndex(user.dailyQuest.GetCurrentClaimIndex());
            }, 1000);
        });

        return () => {
            clearTimeout(timeout);
            user.dailyQuest.claimsList.RemoveListener(listener);
        };
    }, []);

    React.useEffect(() => {
        const claimsList = user.dailyQuest.claimsList.Get();
        if (claimIndex !== -1) {
            const claimTotal = claimsList[claimIndex].daysCount;
            const claimedCount = claimsList[claimIndex].claimed.length;
            setClaimCount(claimTotal - claimedCount);
            setClaimDays(user.dailyQuest.GetClaimDays(claimsList[claimIndex]));
        }
    }, [claimIndex]);

    if (claimDays === null) {
        return null;
    }

    let claimDate = null;
    let isCurrentStreak = false;
    if (claimIndex !== -1 && _init_claimsList.length > 0) {
        const currentClaimList = _init_claimsList[claimIndex];
        isCurrentStreak = user.dailyQuest.IsCurrentList(currentClaimList);
        if (!isCurrentStreak) {
            claimDate = DateFormat(new Date(currentClaimList.start + 'T00:00:00'), 'DD/MM/YYYY');
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

            {claimIndex !== -1 && !isCurrentStreak && claimDate !== null && (
                <Text style={styles.popupText}>{lang['popup']['list-date'].replace('{}', claimDate)}</Text>
            )}

            <FlatList
                data={claimDays}
                keyExtractor={(item) => item.index.toString()}
                initialNumToRender={10}
                renderItem={(props) => <RenderItemMemo item={props.item} claimListIndex={claimIndex} />}
                ListHeaderComponent={<View style={styles.separatorFirst} />}
                ItemSeparatorComponent={RenderSeparator}
                getItemLayout={(_data, index) => ({ length: 68, offset: 68 * index, index })}
                showsVerticalScrollIndicator={false}
            />

            {claimCount > 3 && (
                <View style={styles.claimAllView}>
                    <Button style={styles.claimAllButton} color='background' onPress={user.dailyQuest.ClaimAll}>
                        {lang['popup']['claim-all']}
                    </Button>
                </View>
            )}
        </View>
    );
}

const RenderSeparator = () => <View style={styles.separator} />;

export default RenderPopup;
