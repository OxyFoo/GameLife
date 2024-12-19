import * as React from 'react';
import { View, Image, Linking } from 'react-native';

import styles from '../style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Text } from 'Interface/Components';
import IMG_CHESTS from 'Ressources/items/chests/chests';
import { IMG_OX } from 'Ressources/items/currencies/currencies';

// TODO: Remove & replace by new rarity enum
const CHEST_RARITIES = ['common', 'rare', 'epic', 'legendary'];

/**
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInApp<'global-message'>} NotificationInApp
 */

/**
 * @param {NotificationInApp} notif
 * @param {string} [response]
 * @returns {Promise<boolean>}
 */
async function handleRead(notif, response) {
    const lang = langManager.curr['notifications']['in-app'];

    const callbackID = `notif-${notif.data.ID}`;
    user.server2.tcp.Send({
        action: 'global-message',
        ID: notif.data.ID,
        callbackID: callbackID,
        response: response
    });

    const tcpResponse = await user.server2.tcp.WaitForCallback(callbackID);
    if (tcpResponse !== 'ok') {
        const title = lang['popup-error-title'];
        const message = lang['popup-error-message'];
        user.interface.popup.OpenT({
            type: 'ok',
            data: { title, message }
        });
        return false;
    }

    // Force update notifications to prevent re-claiming
    user.interface.notificationsInApp?.forceUpdate();

    return true;
}

/** @param {NotificationInApp} notif */
async function handleOpenPageOrURL(notif) {
    if (typeof notif.data.data !== 'string') {
        return handleRead(notif);
    }

    user.interface.notificationsInApp?.Close();

    const pageName = user.interface.GetPageName(notif.data.data);
    if (notif.data.action === 'open-page' && pageName !== null) {
        user.interface.ChangePage(pageName);
    } else if (notif.data.action === 'open-link' && (await Linking.canOpenURL(notif.data.data))) {
        Linking.openURL(notif.data.data);
    }

    return handleRead(notif);
}

/** @param {NotificationInApp} notif */
async function handleRespond(notif) {
    // TODO: Update screenInput
    console.log('Not yet implemented');
    return;

    const lang = langManager.curr['notifications']['in-app'];

    user.interface.notificationsInApp?.Close();
    user.interface.screenInput.Open(
        lang['global-message-input'],
        '',
        async (response) => {
            if (typeof response !== 'string' || response.trim().length <= 0) {
                return;
            }

            const success = await handleRead(notif, response.trim());
            if (success) {
                const title = lang['popup-responded-title'];
                const message = lang['popup-responded-message'];
                user.interface.popup.OpenT({
                    type: 'ok',
                    data: { title, message }
                });
            }
        },
        true
    );
}

/** @param {NotificationInApp} notif */
async function handleClaim(notif) {
    const lang = langManager.curr['notifications']['in-app'];

    user.interface.notificationsInApp?.Close();

    // Buy chest
    const data = { notifID: notif.data.ID };
    const result = await user.server.Request('claimGlobalNotifs', data);
    if (result === null) return;

    // Check error
    if (result['status'] !== 'ok' || (!result.hasOwnProperty('newItem') && !result.hasOwnProperty('ox'))) {
        const title = lang['popup-error-title'];
        const message = lang['popup-error-message'];
        user.interface.popup.OpenT({
            type: 'ok',
            data: { title, message },
            cancelable: true,
            priority: true
        });
        return;
    }

    // Update Ox amount
    if (result.hasOwnProperty('ox')) {
        user.informations.ox.Set(result['ox']);
        const title = lang['popup-claim-ox-title'];
        const message = lang['popup-claim-ox-message'].replace('{}', notif.data.data.toString());
        user.interface.popup.OpenT({
            type: 'ok',
            data: { title, message },
            cancelable: true,
            priority: true
        });
    }

    // Update inventory
    if (result.hasOwnProperty('newItem')) {
        const newItem = result['newItem'];
        user.inventory.stuffs.push(newItem);

        // Get chest rarity
        let rarity = 0;
        if (CHEST_RARITIES.includes(notif.data.data.toString())) {
            rarity = CHEST_RARITIES.indexOf(notif.data.data.toString());
        }

        // Show chest opening
        user.interface.ChangePage('chestreward', {
            args: {
                chestRarity: rarity,
                itemID: newItem['ItemID'],
                callback: user.interface.BackHandle
            },
            storeInHistory: false
        });
    }

    // Save inventory
    user.SaveLocal();
    handleRead(notif);
}

/** @param {NotificationInApp} notif */
function renderButtons(notif) {
    const lang = langManager.curr['notifications']['in-app'];

    if (notif.data.action === 'open-link' || notif.data.action === 'open-page') {
        return (
            <View style={styles.globalMessageButtons}>
                <Button
                    style={styles.globalMessageButton}
                    color='main1'
                    fontSize={14}
                    onPress={() => handleOpenPageOrURL(notif)}
                >
                    {lang['global-message-open']}
                </Button>
                <Button
                    style={styles.globalMessageButton}
                    color='danger'
                    fontSize={14}
                    onPress={() => handleRead(notif)}
                >
                    {lang['global-message-close']}
                </Button>
            </View>
        );
    } else if (notif.data.action === 'can-respond' || notif.data.action === 'must-respond') {
        return (
            <View style={styles.globalMessageButtons}>
                <Button
                    style={styles.globalMessageButton}
                    color='main1'
                    fontSize={14}
                    onPress={() => handleRespond(notif)}
                >
                    {lang['global-message-respond']}
                </Button>
                {notif.data.action === 'can-respond' && (
                    <Button
                        style={styles.globalMessageButton}
                        color='danger'
                        fontSize={14}
                        onPress={() => handleRead(notif)}
                    >
                        {lang['global-message-close']}
                    </Button>
                )}
            </View>
        );
    } else if (notif.data.action === 'reward-ox' || notif.data.action === 'reward-chest') {
        return (
            <View style={styles.globalMessageButtons}>
                {RenderReward(notif)}
                <Button
                    style={styles.globalMessageButton}
                    color='main1'
                    fontSize={14}
                    onPress={() => handleClaim(notif)}
                >
                    {lang['global-message-claim']}
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.globalMessageButtons}>
            <Button style={styles.globalMessageButton} color='main1' fontSize={14} onPress={() => handleRead(notif)}>
                {lang['global-message-mark-read']}
            </Button>
        </View>
    );
}

/**
 * @param {object} props
 * @param {NotificationInApp} props.notif
 * @param {number} props.index
 * @returns {JSX.Element}
 */
function NIA_GlobalMessage({ notif }) {
    const title = langManager.GetText(notif.data.message);

    return (
        <View style={styles.globalMessageContainer}>
            <View style={styles.globalMessageText}>
                <Text fontSize={16}>{title}</Text>
            </View>

            <View style={styles.globalMessageButtons}>{renderButtons(notif)}</View>
        </View>
    );
}

/** @param {NotificationInApp} notif */
function RenderReward(notif) {
    const styleReward = {
        ...styles.globalMessageRewardItem,
        backgroundColor: themeManager.GetColor('background')
    };

    if (notif.data.action === 'reward-ox') {
        return (
            <View style={styleReward}>
                <Image style={styles.globalMessageRewardImage} source={IMG_OX} />
                <Text style={styles.globalMessageRewardValue}>{'x' + notif.data.data.toString()}</Text>
            </View>
        );
    } else if (notif.data.action === 'reward-chest') {
        // Use new rarity enum
        let rarity = 0;
        if (CHEST_RARITIES.includes(notif.data.data.toString())) {
            rarity = CHEST_RARITIES.indexOf(notif.data.data.toString());
        }

        return (
            <View style={styleReward}>
                <Image style={styles.globalMessageRewardImage} source={IMG_CHESTS[rarity]} />
            </View>
        );
    }

    return null;
}

export default NIA_GlobalMessage;
