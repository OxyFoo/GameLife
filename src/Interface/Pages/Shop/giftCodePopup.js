import * as React from 'react';
import { View, Keyboard } from 'react-native';

import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';
import dataManager from '../../../Managers/DataManager';

import { Text, Button, Input } from '../../Components';

function renderGiftCodePopup() {
    const lang = langManager.curr['shop'];
    let [ code, setCode ] = React.useState('');
    let [ loading, setLoading ] = React.useState(false);

    const checkCode = async () => {
        if (!code.length) return;
        Keyboard.dismiss();
        setLoading(true);

        const result = await user.server.Request('giftCode', { code });
        if (result === null) return;

        if (result['status'] !== 'ok') {
            // Error
            const title = lang['reward-failed-title'];
            const text = lang['reward-failed-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ], undefined, false);
            return;
        }

        const gift = result['gift'];
        if (gift === null) {
            // Incorrect code
            const title = lang['reward-wrong-title'];
            const text = lang['reward-wrong-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ], this.openPopupCode, false);
            return;
        }

        // Success
        const rewards = dataManager.achievements.parseReward(gift);
        const title = lang['reward-success-title'];
        let text = lang['reward-success-text'] + '\n\n';
            text += user.achievements.getRewardsText(rewards);
        user.interface.popup.ForceOpen('ok', [ title, text ], undefined, false);

        await user.OnlineLoad(true);
        this.forceUpdate();
    }

    return (
        <View style={{ padding: 24 }}>
            <Text fontSize={22}>{lang['alert-code-title']}</Text>
            <Text style={{ marginTop: 12, textAlign: 'left' }} fontSize={14}>
                {lang['alert-code-text']}
            </Text>

            <Input
                style={{ marginTop: 12 }}
                height={42}
                label={lang['alert-code-input']}
                text={code}
                onChangeText={setCode}
                maxLength={8}
                enabled={!loading}
            />
            <Button
                style={{ marginTop: 24 }}
                color='main1'
                onPress={checkCode}
                loading={loading}
            >
                {lang['alert-code-button']}
            </Button>
        </View>
    );
}

export default renderGiftCodePopup;