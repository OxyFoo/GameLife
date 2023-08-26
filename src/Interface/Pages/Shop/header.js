import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import renderGiftCodePopup from './popupGiftCode';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Icon, Text, Button } from 'Interface/Components';

class ShopHeader extends React.Component {
    state = {
        oxAmount: user.informations.ox.Get()
    };

    componentDidMount() {
        const updateOx = () => this.setState({ oxAmount: user.informations.ox.Get() });
        this.oxListener = user.informations.ox.AddListener(updateOx);
    }
    componentWillUnmount() {
        user.informations.ox.RemoveListener(this.oxListener);
    }

    openPopupCode = () => {
        if (!user.server.online) return;
        user.interface.popup.Open('custom', renderGiftCodePopup.bind(this));
    }
    openAd = () => {
        if (!user.server.online) return;
    }
    openOxShop = () => {
        if (!user.server.online) return;
        const lang = langManager.curr['shop'];
        const title = lang['temp-comingsoon-title'];
        const text = lang['temp-comingsoon-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }

    render() {
        const lang = langManager.curr['shop'];
        const { oxAmount } = this.state;
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
                    disabled={!user.server.online}
                >
                    <Text fontSize={16} color='main1'>{lang['button-header-ad']}</Text>
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
        justifyContent: 'space-between'
    },
    badge: {
        width: '32%',
    },
    ox: {
        marginLeft: 2
    }
});

export default ShopHeader;