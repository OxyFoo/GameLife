import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button, Zap } from 'Interface/Components';

/**
 * @typedef {import('Data/User/Activities/index').Activity} Activity
 * @typedef {import('react-native').ListRenderItemInfo<Activity>} ListRenderItemInfo
 */

const renderNoRemaining = () => {
    const lang = langManager.curr['zap-gpt'];

    return (
        <View style={styles.panel}>
            <Text style={styles.title} fontSize={24}>
                {lang['no-remaining-title']}
            </Text>

            <View style={styles.noRemaining}>
                <Text style={styles.noRemainingText} color='primary' fontSize={22}>
                    {lang['no-remaining-text']}
                </Text>

                <View style={styles.noRemainingBack}>
                    <Zap.High style={styles.noRemainingZap} />
                </View>
            </View>
        </View>
    );
}

const renderNotConnected = () => {
    const lang = langManager.curr['zap-gpt'];

    return (
        <View style={styles.panel}>
            <Text style={styles.title} fontSize={24}>
                {lang['not-connected-title']}
            </Text>

            <View style={styles.noRemaining}>
                <Text style={styles.noRemainingText} color='primary' fontSize={22}>
                    {lang['not-connected-text']}
                </Text>

                <View style={styles.noRemainingBack}>
                    <Zap.High style={styles.noRemainingZap} />
                </View>
            </View>
        </View>
    );
}

const renderNotBuyed = (callback = () => {}) => {
    const lang = langManager.curr['zap-gpt'];

    const onPress = () => {
        callback();
        user.interface.ChangePage('shop');
    };

    return (
        <View style={styles.panel}>
            <Text style={styles.notBuyedText1} fontSize={20}>
                {lang['not-buyed-text1']}
            </Text>

            <View style={styles.notBuyed}>
                <View style={styles.notBuyedText2Container}>
                    <Text style={styles.notBuyedText2} color='primary' fontSize={22}>
                        {lang['not-buyed-text2']}
                    </Text>
                </View>

                <Zap.High style={styles.noRemainingZap} />
            </View>

            <Button color='main1' onPress={onPress}>
                {lang['not-buyed-button']}
            </Button>
        </View>
    );
}

export { renderNoRemaining, renderNotConnected, renderNotBuyed };
