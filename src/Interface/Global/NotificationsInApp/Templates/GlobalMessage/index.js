import * as React from 'react';
import { View, Linking, FlatList } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Reward, Text } from 'Interface/Components';
import { NIA_GlobalActionType } from '@oxyfoo/gamelife-types/Class/NotificationsInApp';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Class/Rewards').RawReward} RawReward
 * @typedef {import('@oxyfoo/gamelife-types/Class/NotificationsInApp').NotificationInApp<'global-message'>} NotificationInApp
 */

let claimLoading = false;

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

            <View style={styles.globalMessageButtons}>
                <RenderContent notif={notif} />
            </View>
        </View>
    );
}

/**
 * @param {Object} props
 * @param {NotificationInApp} props.notif
 */
function RenderContent({ notif }) {
    const lang = langManager.curr['notifications']['in-app'];

    switch (notif.data.action) {
        case NIA_GlobalActionType.OPEN_LINK:
        case NIA_GlobalActionType.OPEN_PAGE:
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

        case NIA_GlobalActionType.CAN_RESPOND:
        case NIA_GlobalActionType.MUST_RESPOND:
            return (
                <View style={styles.globalMessageButtons}>
                    <Button
                        style={styles.globalMessageButton}
                        color='main1'
                        fontSize={14}
                        onPress={() => handleResponse(notif)}
                    >
                        {lang['global-message-respond']}
                    </Button>
                    {notif.data.action === NIA_GlobalActionType.CAN_RESPOND && (
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

        case NIA_GlobalActionType.REWARD:
            const rawRewards = /** @type {RawReward[]} */ (notif.data.data);

            return (
                <View style={styles.globalMessageButtons}>
                    {/** Hidden claim button to center the unique reward */}
                    {rawRewards.length === 1 && (
                        <Button style={[styles.globalMessageButton, styles.globalMessageButtonHidden]} fontSize={14}>
                            {lang['global-message-claim']}
                        </Button>
                    )}

                    <FlatList
                        keyExtractor={(item, index) => `${item.Type}-${index}`}
                        contentContainerStyle={styles.rewardList}
                        data={rawRewards}
                        renderItem={Reward}
                        horizontal
                    />

                    <Button style={styles.globalMessageButton} fontSize={14} onPress={() => handleClaim(notif)}>
                        {lang['global-message-claim']}
                    </Button>
                </View>
            );

        case NIA_GlobalActionType.NONE:
        default:
            return (
                <View style={styles.globalMessageButtons}>
                    <Button
                        style={styles.globalMessageButton}
                        color='main1'
                        fontSize={14}
                        onPress={() => handleRead(notif)}
                    >
                        {lang['global-message-mark-read']}
                    </Button>
                </View>
            );
    }
}

/** @param {NotificationInApp} notif */
async function handleRead(notif) {
    const lang = langManager.curr['notifications']['in-app'];

    const response = await user.server2.tcp.SendAndWait({
        action: 'read-global-notification',
        notificationID: notif.data.ID
    });

    if (response === 'not-sent' || response === 'timeout' || response === 'interrupted') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['popup-error-title'],
                message: lang['popup-error-message'].replace('{}', response)
            }
        });
        user.interface.console?.AddLog('error', `[NIA_GlobalMessage] handleRead: Notif not sent (status: ${response})`);
        return;
    }

    if (response.status !== 'read-global-notification' || response.result === 'error') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['popup-error-title'],
                message: lang['popup-error-message'].replace('{}', 'error')
            }
        });
        user.interface.console?.AddLog(
            'error',
            `[NIA_GlobalMessage] handleRead: Notif not read (status: ${response.status})`
        );
        return;
    }

    if (response.result === 'not-found' || response.result !== 'ok') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['popup-error-title'],
                message: lang['popup-error-message'].replace('{}', response.result)
            }
        });
        user.interface.console?.AddLog(
            'error',
            `[NIA_GlobalMessage] handleRead: Notif not found (status: ${response.result})`
        );
        return;
    }

    user.notificationsInApp.Remove(notif);
}

/** @param {NotificationInApp} notif */
async function handleResponse(notif) {
    const lang = langManager.curr['notifications']['in-app'];

    user.interface.screenInput?.Open({
        label: lang['global-message-input'],
        callback: async (response) => {
            if (response === null || response.trim().length <= 0) {
                return;
            }

            const userMessage = response.trim();
            if (userMessage.length <= 0) {
                return;
            }

            const responseStatus = await sendResponse(notif, userMessage);
            if (responseStatus === 'ok') {
                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['popup-responded-title'],
                        message: lang['popup-responded-message']
                    }
                });
            } else {
                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['popup-error-title'],
                        message: lang['popup-error-message'].replace('{}', responseStatus)
                    }
                });
            }

            user.interface.notificationsInApp?.Close();
        }
    });
}

/**
 * @param {NotificationInApp} notif
 * @param {string} message
 * @returns {Promise<'ok' | 'not-sent' | 'timeout' | 'interrupted' | 'not-found' | 'error'>}
 */
async function sendResponse(notif, message) {
    const response = await user.server2.tcp.SendAndWait({
        action: 'respond-global-notification',
        notificationID: notif.data.ID,
        response: message
    });

    if (response === 'not-sent' || response === 'timeout' || response === 'interrupted') {
        user.interface.console?.AddLog(
            'error',
            `[NIA_GlobalMessage] handleResponse: Notif not sent (status: ${response})`
        );
        return response;
    }

    if (response.status !== 'respond-global-notification' || response.result === 'error') {
        user.interface.console?.AddLog(
            'error',
            `[NIA_GlobalMessage] handleResponse: Notif not read (status: ${response.status})`
        );
        return 'error';
    }

    if (response.result === 'not-found' || response.result !== 'ok') {
        user.interface.console?.AddLog(
            'error',
            `[NIA_GlobalMessage] handleResponse: Notif not found (status: ${response.result})`
        );
        return 'not-found';
    }

    user.notificationsInApp.Remove(notif);

    return 'ok';
}

/** @param {NotificationInApp} notif */
async function handleOpenPageOrURL(notif) {
    if (typeof notif.data.data !== 'string') {
        return handleRead(notif);
    }

    const pageOrUrl = notif.data.data.trim();
    user.interface.notificationsInApp?.Close();

    // Open page
    if (notif.data.action === NIA_GlobalActionType.OPEN_PAGE) {
        const pageName = user.interface.GetPageName(pageOrUrl);
        if (pageName !== null) {
            user.interface.ChangePage(pageName);
        } else {
            user.interface.console?.AddLog(
                'error',
                `[NIA_GlobalMessage] handleOpenPageOrURL: Page not found (${pageOrUrl})`
            );
        }
    }

    // Open link
    else if (notif.data.action === NIA_GlobalActionType.OPEN_LINK) {
        // TODO: Why this function is too complex? Anyway, if Openurl fails, nothing happens
        // const urlIsValid = await Linking.canOpenURL(pageOrUrl);
        Linking.openURL(pageOrUrl);
    }

    return handleRead(notif);
}

/** @param {NotificationInApp} notif */
async function handleClaim(notif) {
    const lang = langManager.curr['notifications']['in-app'];

    user.interface.notificationsInApp?.Close();

    if (claimLoading) {
        return;
    }

    claimLoading = true;

    // Claim reward
    const response = await user.server2.tcp.SendAndWait({
        action: 'claim-global-notification',
        notificationID: notif.data.ID
    });

    // Network error
    if (response === 'not-sent' || response === 'timeout' || response === 'interrupted') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['popup-error-title'],
                message: lang['popup-error-message'].replace('{}', response)
            }
        });
        user.interface.console?.AddLog(
            'error',
            `[NIA_GlobalMessage] handleClaim: Notif not sent (status: ${response})`
        );

        claimLoading = false;
        return;
    }

    if (response.status !== 'claim-global-notification' || typeof response.result === 'string') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['popup-error-title'],
                message: lang['popup-error-message'].replace('{}', response.status)
            }
        });
        if (response.status !== 'claim-global-notification') {
            user.interface.console?.AddLog(
                'error',
                `[NIA_GlobalMessage] handleClaim: Notif not claimed (status: ${response.status})`
            );
        } else {
            user.interface.console?.AddLog(
                'error',
                `[NIA_GlobalMessage] handleClaim: Notif not claimed (status: ${response.result})`
            );
        }

        claimLoading = false;
        return;
    }

    const rewardsExecuted = user.rewards.ExecuteRewards(response.result.rewards);
    if (!rewardsExecuted) {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['popup-error-title'],
                message: lang['popup-error-message'].replace('{}', 'rewards-not-executed')
            }
        });
        user.interface.console?.AddLog('error', `[NIA_GlobalMessage] handleClaim: Rewards not executed`);

        claimLoading = false;
        return;
    }

    await user.rewards.ShowRewards(
        response.result.rewards,
        'all',
        lang['popup-claim-title'],
        lang['popup-claim-premessage']
    );

    // Save inventory
    await user.SaveLocal();
    await handleRead(notif);

    claimLoading = false;
}

export default NIA_GlobalMessage;
