import React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import { RenderItemMemo } from './element';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import NONZERODAYS_REWARDS from 'Ressources/items/quests/NonZeroDay';
import { Text } from 'Interface/Components';
import { DateToFormatString } from 'Utils/Date';
import { GetDate } from 'Utils/Time';

function RenderPopup(props) {
    const lang = langManager.curr['nonzerodays'];
    const stylePopup = {
        backgroundColor: themeManager.GetColor('background')
    };
    const titleColors = [
        themeManager.GetColor('backgroundCard'),
        themeManager.GetColor('main1'),
        themeManager.GetColor('main2')
    ];

    const claimsList = user.quests.nonzerodays.claimsList.Get();
    const [ claimIndex, setClaimIndex ] = React.useState(user.quests.nonzerodays.GetCurrentClaimIndex());

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

    return (
        <View style={[styles.popup, stylePopup]}>
            <LinearGradient
                style={styles.popupTitleContainer}
                colors={titleColors}
                start={{ x: 0, y: -2 }}
                end={{ x: 1, y: 2 }}
            >
                <Text style={styles.popupTitle}>
                    {lang['container-title']}
                </Text>
            </LinearGradient>

            {claimIndex !== -1 && claimIndex !== claimsList.length - 1 && (
                <Text style={styles.popupText}>
                    {lang['container-date'].replace('{}',
                        DateToFormatString(GetDate(claimsList[claimIndex].start))
                    )}
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
                ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                )}
                getItemLayout={(data, index) => (
                    { length: 68, offset: 68 * index, index }
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

export default RenderPopup;
