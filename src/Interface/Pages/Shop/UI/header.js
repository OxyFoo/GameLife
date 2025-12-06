import * as React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Gradient } from 'Interface/Primitives';
import { Text, Button, Icon } from 'Interface/Components';

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
        const oxTextSize = oxAmountStr.length < 3 ? 16 : 16 + 2 - oxAmountStr.length;

        return (
            <Animated.View style={[styles.parent, style]}>
                <View style={styles.content}>
                    <Button
                        style={styles.badge}
                        styleContent={adState !== 'wait' && styles.badgeContent}
                        gradientColors={['#38406573', '#3840651F']}
                        gradientColorsAngle={-45}
                        onPress={this.openAd}
                        loading={adState === 'wait'}
                        disabled={!user.server2.IsAuthenticated()}
                    >
                        <Gradient
                            containerStyle={styles.badgeGradientContainer}
                            style={styles.badgeGradient}
                            colors={[themeManager.GetColor('main2'), themeManager.GetColor('main3')]}
                            angle={45}
                        >
                            <Icon icon='gift' color='grey' />
                        </Gradient>
                        <Text fontSize={16} color='main1'>
                            {lang['button-header-ad'].replace('{}', oxGain.toString())}
                        </Text>
                        <Icon style={styles.badgeIcon} icon='ox' />
                    </Button>

                    <Button
                        style={styles.badge}
                        styleContent={styles.badgeContent}
                        gradientColors={['#38406573', '#3840651F']}
                        gradientColorsAngle={-45}
                        onPress={this.openOxShop}
                        disabled={!user.server2.IsAuthenticated()}
                    >
                        <Gradient
                            containerStyle={styles.badgeGradientContainer}
                            style={styles.badgeGradient}
                            colors={[themeManager.GetColor('main2'), themeManager.GetColor('main3')]}
                            angle={45}
                        >
                            <Icon icon='add' color='grey' />
                        </Gradient>
                        <Text fontSize={oxTextSize} color='main1'>
                            {oxAmountStr}
                        </Text>
                        <Icon style={styles.badgeIcon} icon='ox' />
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
        width: '40%',
        paddingVertical: 0,
        paddingHorizontal: 0,
        justifyContent: 'center'
    },
    badgeContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    badgeIcon: {
        marginRight: 6
    },
    badgeGradientContainer: {
        borderRadius: 8
    },
    badgeGradient: {
        aspectRatio: 1,
        padding: 8
    }
});

export default ShopHeader;
