import * as React from 'react';
import { View, Keyboard, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { Text, Button, Input } from 'Interface/Components';

/**
 * @typedef {import('../back').default} BackShop
 */

function openPopupCode() {
    if (!user.server.IsConnected()) return;
    user.interface.popup.Open('custom', renderGiftCodePopup);
}

/**
 * Check code and give rewards
 * @param {string} code
 * @returns {Promise<void>}
 */
async function checkCode(code) {
    const lang = langManager.curr['shop'];

    if (!code.length) return;
    Keyboard.dismiss();

    const result = await user.server.Request('giftCode', { code });
    if (result === null) return;

    if (result['status'] !== 'ok') {
        // Error
        const title = lang['reward-failed-title'];
        const text = lang['reward-failed-message'];
        user.interface.popup.ForceOpen('ok', [ title, text ], undefined, false);
        return;
    }

    const gift = result['gift'];
    if (gift === null) {
        // Incorrect code
        const title = lang['reward-wrong-title'];
        const text = lang['reward-wrong-text'];
        user.interface.popup.ForceOpen('ok', [ title, text ], openPopupCode, false);
        return;
    }

    // Success
    // TODO: Already parsed
    const rewards = /** @type {import('Data/Achievements').Reward[]} */ ([]); //dataManager.achievements.parseReward(gift);
    const title = lang['reward-success-title'];
    let text = lang['reward-success-text'] + '\n\n';
        text += user.achievements.getRewardsText(rewards);
    user.interface.popup.ForceOpen('ok', [ title, text ], undefined, false);

    await user.OnlineLoad('inventories');
}

function renderGiftCodePopup() {
    const lang = langManager.curr['shop'];
    let [ code, setCode ] = React.useState('');
    let [ loading, setLoading ] = React.useState(false);

    const onCheckButton = async () => {
        setLoading(true);
        await checkCode(code);
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text fontSize={22}>{lang['alert-code-title']}</Text>
            <Text style={styles.text} fontSize={14}>
                {lang['alert-code-text']}
            </Text>

            <Input
                style={styles.input}
                height={42}
                label={lang['alert-code-input']}
                text={code}
                onChangeText={setCode}
                maxLength={8}
                enabled={!loading}
            />
            <Button
                style={styles.button}
                color='main1'
                onPress={onCheckButton}
                loading={loading}
            >
                {lang['alert-code-button']}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24
    },
    text: {
        marginTop: 12,
        textAlign: 'left'
    },
    input: {
        marginTop: 12
    },
    button: {
        marginTop: 24
    }
});

export { openPopupCode };
export default renderGiftCodePopup;
