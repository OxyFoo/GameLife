import * as React from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';

import { openPopupCode } from './popupGiftCode';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { IMG_OX } from 'Ressources/items/currencies/currencies';
import { OX_AMOUNT } from 'Class/Admob';
import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('Class/Admob').AdEvent} AdEvent
 * @typedef {import('Class/Admob').AdStates} AdStates
 * @typedef {import('Class/Admob').AdTypes} AdTypes
 * @typedef {import('Interface/Components').Page} Page
 */

const ShopHeaderPropTypes = {
    /** @type {Page | null} */
    refPage: null
};

class ShopHeader extends React.Component {
    state = {
        /** @type {AdStates} */
        adState: 'wait',

        oxAmount: user.informations.ox.Get()
    }

    refTuto1 = null;
    refTuto2 = null;
    refTuto3 = null;

    /** @type {AdTypes | null} */
    rewardedShop = null;

    componentDidMount() {
        this.oxListener = user.informations.ox.AddListener((newOx) => {
            this.setState({ oxAmount: newOx });
        });

        this.rewardedShop = user.admob.Get('rewarded', 'shop', this.onAdStateChange);
    }
    componentWillUnmount() {
        user.informations.ox.RemoveListener(this.oxListener);
        user.admob.ClearEvents(this.rewardedShop);
    }

    openAd = () => {
        const lang = langManager.curr['server'];

        // Check if the user can watch an ad
        if (user.informations.adRemaining <= 0) {
            const title = lang['alert-aderror-title'];
            const message = lang['alert-aderror-message-nomore'];
            user.interface.popup.Open('ok', [ title, message ]);
        }

        // Check if ads are loading
        else if (this.state.adState === 'wait') {
            const title = lang['alert-aderror-title'];
            const message = lang['alert-aderror-message-wait'];
            user.interface.popup.Open('ok', [ title, message ]);
        }

        // Check if the user is connected to the server and if the ad is loaded
        else if (!user.server.IsConnected() ||
                !this.rewardedShop || !this.rewardedShop.ad.loaded) {
            const title = lang['alert-aderror-title'];
            const message = lang['alert-aderror-message-error'];
            user.interface.popup.Open('ok', [ title, message ]);
        }

        // Show the ad
        else {
            this.rewardedShop.ad.show();
        }
    }
    openOxShop = () => {
        if (!user.server.IsConnected()) return;
        const lang = langManager.curr['shop'];
        const title = lang['temp-comingsoon-title'];
        const text = lang['temp-comingsoon-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }

    /** @type {AdEvent} */
    onAdStateChange = (state) => {
        const lang = langManager.curr['server'];

        if (state === 'ready') {
            if (user.informations.adRemaining > 0) {
                this.setState({ adState: 'ready' });
            } else {
                this.setState({ adState: 'notAvailable' });
            }
        }

        else if (state === 'closed') {
            const title = lang['alert-adsuccess-title'];
            const text  = lang['alert-adsuccess-message']
                            .replace('{}', OX_AMOUNT.toString());
            user.interface.popup.Open('ok', [ title, text ], undefined, true);
            this.setState({ adState: 'wait' });
        }

        else {
            this.setState({ adState: state });
        }
    }

    render() {
        const lang = langManager.curr['shop'];
        const { refPage } = this.props;
        const { oxAmount, adState } = this.state;
        const oxAmountStr = oxAmount.toString();

        const parentStyle = {
            backgroundColor: themeManager.GetColor('ground1a'),
            transform: [{
                translateY: Animated.subtract(0, refPage?.state?.positionY || 0)
            }]
        };
        const oxTextSize = oxAmountStr.length < 3 ? 16 : 16 + 2 - oxAmountStr.length;
        const oxIconSize = oxAmountStr.length < 3 ? 20 : oxAmountStr.length < 5 ? 18 : 16;

        return (
            <Animated.View style={[styles.parent, parentStyle]}>
                <View style={styles.content}>
                    <Button.Badge
                        ref={ref => this.refTuto1 = ref}
                        style={styles.badge}
                        icon='gift'
                        onPress={openPopupCode}
                        disabled={!user.server.IsConnected()}
                    >
                        <Text fontSize={16} color='main1'>{lang['button-header-code']}</Text>
                    </Button.Badge>

                    <Button.Badge
                        ref={ref => this.refTuto2 = ref}
                        style={styles.badge}
                        icon='media'
                        badgeJustifyContent='space-around'
                        onPress={this.openAd}
                        loading={adState === 'wait'}
                        disabled={!(user.server.IsConnected() && adState === 'ready')}
                    >
                        <Text fontSize={16} color='main1'>
                            {lang['button-header-ad'].replace('{}', OX_AMOUNT.toString())}
                        </Text>
                        <Image style={styles.ox} source={IMG_OX} />
                    </Button.Badge>

                    <Button.Badge
                        ref={ref => this.refTuto3 = ref}
                        style={styles.badge}
                        icon='addSquare'
                        badgeJustifyContent='space-around'
                        onPress={this.openOxShop}
                        disabled={!user.server.IsConnected()}
                    >
                        <Text fontSize={oxTextSize} color='main1'>{oxAmountStr}</Text>
                        <Image style={[styles.ox, { width: oxIconSize }]} source={IMG_OX} />
                    </Button.Badge>
                </View>
            </Animated.View>
        );
    }
}

ShopHeader.prototype.props = ShopHeaderPropTypes;
ShopHeader.defaultProps = ShopHeaderPropTypes;

const styles = StyleSheet.create({
    parent: {
        paddingVertical: 6,
        marginBottom: 24,

        zIndex: 100,
        elevation: 100
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginHorizontal: 24
    },
    badge: {
        width: '32%',
    },
    ox: {
        width: 20,
        aspectRatio: 1,
        marginLeft: 2
    }
});

export default ShopHeader;
