import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { FirebaseAdMobTypes } from '@react-native-firebase/admob';

import renderGiftCodePopup from './popupGiftCode';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { OX_AMOUNT } from 'Class/Admob';
import { Icon, Text, Button } from 'Interface/Components';

/**
 * @typedef {import('Class/Admob').AdEvent} AdEvent
 * @typedef {import('Class/Admob').AdStates} AdStates
 */

class ShopHeader extends React.Component {
    state = {
        /** @type {AdStates} */
        adState: 'wait',
        adReady: false,

        oxAmount: user.informations.ox.Get()
    };

    /** @type {FirebaseAdMobTypes.RewardedAd|null} */
    rewardedShop = null;

    componentDidMount() {
        const updateOx = () => this.setState({ oxAmount: user.informations.ox.Get() });
        this.oxListener = user.informations.ox.AddListener(updateOx);

        this.rewardedShop = user.admob.Get('rewarded', 'shop', this.onAdStateChange);
    }
    componentWillUnmount() {
        user.informations.ox.RemoveListener(this.oxListener);
        user.admob.ClearEvents('rewarded', 'shop');
    }

    openPopupCode = () => {
        if (!user.server.online) return;
        user.interface.popup.Open('custom', renderGiftCodePopup.bind(this));
    }
    openAd = () => {
        const lang = langManager.curr['server'];

        // Check if the user can watch an ad
        if (user.informations.adRemaining <= 0) {
            const title = lang['alert-aderror-title'];
            const message = lang['alert-aderror-message-nomore'];
            user.interface.popup.Open('ok', [ title, message ]);
        }

        // Check if the user is connected to the server and if the ad is loaded
        else if (!user.server.online ||
                this.rewardedShop || !this.rewardedShop.loaded) {
            const title = lang['alert-aderror-title'];
            const message = lang['alert-aderror-message-error'];
            user.interface.popup.Open('ok', [ title, message ]);
        }

        // Show the ad
        else {
            this.rewardedShop.show();
        }
    }
    openOxShop = () => {
        if (!user.server.online) return;
        const lang = langManager.curr['shop'];
        const title = lang['temp-comingsoon-title'];
        const text = lang['temp-comingsoon-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }

    /** @type {AdEvent} */
    onAdStateChange = (state) => {
        const lang = langManager.curr['server'];
        const adReady = state === 'ready' && user.informations.adRemaining > 0;

        if (this.state.adReady !== adReady) {
            this.setState({ adReady });
        }

        if (state === 'closed') {
            const title = lang['alert-adsuccess-title'];
            const text  = lang['alert-adsuccess-message']
                            .replace('{}', OX_AMOUNT.toString());
            user.interface.popup.Open('ok', [ title, text ], undefined, true);
        }
    }

    render() {
        const lang = langManager.curr['shop'];
        const { oxAmount, adReady } = this.state;
        const oxAmountStr = oxAmount.toString();

        const oxTextSize = oxAmountStr.length < 3 ? 16 : 16 + 2 - oxAmountStr.length;
        const oxIconSize = oxAmountStr.length < 3 ? 20 : oxAmountStr.length < 5 ? 18 : 16;

        return (
            <View style={styles.parent}>
                <Button.Badge
                    style={styles.badge}
                    icon='gift'
                    onPress={this.openPopupCode}
                    disabled={!user.server.online}
                >
                    <Text fontSize={16} color='main1'>{lang['button-header-code']}</Text>
                </Button.Badge>

                <Button.Badge
                    style={styles.badge}
                    icon='media'
                    badgeJustifyContent='space-around'
                    onPress={this.openAd}
                    disabled={!(user.server.online && adReady)}
                >
                    <Text fontSize={16} color='main1'>
                        {lang['button-header-ad'].replace('{}', OX_AMOUNT.toString())}
                    </Text>
                    <Icon icon='ox' color='main1' size={20} />
                </Button.Badge>

                <Button.Badge
                    style={styles.badge}
                    icon='addSquare'
                    badgeJustifyContent='space-around'
                    onPress={this.openOxShop}
                    disabled={!user.server.online}
                >
                    <Text fontSize={oxTextSize} color='main1'>{oxAmountStr}</Text>
                    <Icon style={styles.ox} icon='ox' color='main1' size={oxIconSize} />
                </Button.Badge>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    parent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginBottom: 24
    },
    badge: {
        width: '32%',
    },
    ox: {
        marginLeft: 2
    }
});

export default ShopHeader;