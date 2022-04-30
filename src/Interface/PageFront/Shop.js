import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackShop from '../PageBack/Shop';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

import { UserHeader } from '../Widgets';
import { Page, Icon, Text, Button, Input } from '../Components';

class Shop extends BackShop {
    renderCodePopup() {
        const lang = langManager.curr['shop'];
        let [ code, setCode ] = React.useState('');
        let [ loading, setLoading ] = React.useState(false);

        const checkCode = async () => {
            if (!code.length) return;
            setLoading(true);
            const result = await user.server.GiftCode(code);
            if (result.status !== 200 || result.content['status'] !== 'ok') {
                // Error
                const title = lang['reward-failed-title'];
                const text = lang['reward-failed-text'];
                user.interface.popup.ForceOpen('ok', [ title, text ], undefined, false);
                return;
            }

            const gift = result.content['gift'];
            if (gift === null) {
                // Incorrect code
                const title = lang['reward-wrong-title'];
                const text = lang['reward-wrong-text'];
                user.interface.popup.ForceOpen('ok', [ title, text ], undefined, false);
                return;
            }

            // Success
            await user.OnlineLoad(true);

            const rewards = dataManager.achievements.parseReward(gift);
            const title = lang['reward-success-title'];
            let text = lang['reward-success-text'] + '\n\n';
                text += user.achievements.getRewardsText(rewards);
            user.interface.popup.ForceOpen('ok', [ title, text ], undefined, false);
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

    render() {
        const lang = langManager.curr['shop'];
        const adRemaining = user.informations.adRemaining;

        return (
            <Page canScrollOver={true}>
                <UserHeader />
                <View style={styles.wallet}>
                    <Text style={styles.ox} color='main1'>{user.informations.ox}</Text>
                    <Icon icon='ox' color='main1' size={24} />
                </View>

                <Button.Ad
                    style={[styles.button, styles.adButton]}
                    state={adRemaining <= 0 ? 'notAvailable' : this.state.adState}
                    color='main2'
                    onPress={this.watchAd}
                />

                <Button
                    style={styles.button}
                    color='white'
                    colorText='main1'
                    icon='chevron'
                    iconColor='main1'
                    enabled={user.server.online}
                    onPress={this.openShopBuy}
                >{lang['button-shop']}</Button>

                <Button
                    style={styles.button}
                    color='main1'
                    icon='add'
                    enabled={user.server.online}
                    onPress={this.openPopupCode}
                >{lang['button-code']}</Button>
            </Page>
        )
    }
}

const styles = StyleSheet.create({
    wallet: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    ox: {
        marginRight: 6
    },

    button: { marginTop: 24 },
    adButton: { justifyContent: 'space-between', borderRadius: 14 },
    adText: { marginRight: 6 },
    adIcon: { flexDirection: 'row' }
});

export default Shop;