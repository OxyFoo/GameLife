import * as React from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { IMG_OX } from 'Ressources/items/currencies/currencies';
import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 *
 * @typedef {import('Class/Ads').AdEvent} AdEvent
 * @typedef {import('Class/Ads').AdStates} AdStates
 * @typedef {import('Class/Ads').AdEventFunction} AdEventFunction
 */

const ShopHeaderPropTypes = {
    /** @type {StyleViewProp} */
    style: {}
};

class ShopHeader extends React.Component {
    state = {
        /** @type {AdStates} */
        adState: 'wait',

        oxGain: 0,
        oxAmount: user.informations.ox.Get()
    };

    /** @type {Symbol | null} */
    oxListener = null;

    refTuto1 = null;
    refTuto2 = null;
    refTuto3 = null;

    /** @type {AdEvent | null} */
    rewardedShop = null;

    componentDidMount() {
        this.oxListener = user.informations.ox.AddListener((newOx) => {
            this.setState({ oxAmount: newOx });
        });

        this.rewardedShop = user.ads.Get('shop', this.onAdStateChange);
    }

    componentWillUnmount() {
        user.informations.ox.RemoveListener(this.oxListener);
        if (this.rewardedShop) {
            user.ads.ClearEvents(this.rewardedShop);
        }
    }

    openAd = () => {
        const lang = langManager.curr['server'];

        // Check if the user can watch an ad
        if (user.informations.adRemaining <= 0) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-aderror-title'],
                    message: lang['alert-aderror-nomore-message']
                }
            });
        }

        // Check if ads are loading
        else if (this.state.adState === 'wait') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-aderror-loading-title'],
                    message: lang['alert-aderror-loading-message']
                }
            });
        }

        // Check if the user is connected to the server and if the ad is loaded
        else if (!user.server2.IsAuthenticated() || !this.rewardedShop || !this.rewardedShop.ad?.loaded) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-aderror-title'],
                    message: lang['alert-aderror-message']
                }
            });
        }

        // Show the ad
        else {
            this.rewardedShop.ad.show();
        }
    };

    openOxShop = () => {
        if (!user.server2.IsAuthenticated()) return;

        // TODO: ???
        // user.interface.GetCurrentPage()?.refPage?.GotoY(400);
    };

    /** @type {AdEventFunction} */
    onAdStateChange = (ad, state) => {
        const lang = langManager.curr['server'];

        if (state === 'ready') {
            if (user.informations.adRemaining > 0) {
                this.setState({ adState: 'ready', oxGain: ad.RewardOx });
            } else {
                this.setState({ adState: 'notAvailable' });
            }
        } else if (state === 'closed') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-adsuccess-title'],
                    message: lang['alert-adsuccess-message'].replace('{}', ad.RewardOx.toString())
                },
                cancelable: false
            });
            this.setState({ adState: 'wait' });
        } else {
            this.setState({ adState: state });
        }
    };

    render() {
        const lang = langManager.curr['shop'];
        const { style } = this.props;
        const { adState, oxAmount, oxGain } = this.state;
        const oxAmountStr = oxAmount.toString();

        /** @type {ViewStyle} */
        const parentStyle = {
            backgroundColor: themeManager.GetColor('ground1a')
            // transform: [
            //     {
            //         translateY: Animated.subtract(0, refPage?.state?.positionY || 0)
            //     }
            // ]
        };
        const oxTextSize = oxAmountStr.length < 3 ? 16 : 16 + 2 - oxAmountStr.length;
        const oxIconSize = oxAmountStr.length < 3 ? 20 : oxAmountStr.length < 5 ? 18 : 16;

        return (
            <Animated.View style={[styles.parent, parentStyle, style]}>
                <View style={styles.content}>
                    <Button
                        ref={this.refTuto2}
                        style={styles.badge}
                        //icon='media'
                        //badgeJustifyContent='space-around'
                        onPress={this.openAd}
                        loading={adState === 'wait'}
                        disabled={!(user.server2.IsAuthenticated() && adState === 'ready')}
                    >
                        <Text fontSize={16} color='main1'>
                            {lang['button-header-ad'].replace('{}', oxGain.toString())}
                        </Text>
                        <Image style={styles.ox} source={IMG_OX} />
                    </Button>

                    <Button
                        ref={this.refTuto3}
                        style={styles.badge}
                        //icon='addSquare'
                        //badgeJustifyContent='space-around'
                        onPress={this.openOxShop}
                        disabled={!user.server2.IsAuthenticated()}
                    >
                        <Text fontSize={oxTextSize} color='main1'>
                            {oxAmountStr}
                        </Text>
                        <Image style={[styles.ox, { width: oxIconSize }]} source={IMG_OX} />
                    </Button>
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
        justifyContent: 'space-evenly',

        marginHorizontal: 24
    },
    badge: {
        width: '32%'
    },
    ox: {
        width: 20,
        aspectRatio: 1,
        marginLeft: 2
    }
});

export default ShopHeader;
