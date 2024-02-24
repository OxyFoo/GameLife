import * as React from 'react';
import { View, Linking } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('Types/NotificationInApp').NotificationInApp<'global-message'>} NotificationInApp
 */

// - [x] none
// - [x] respond
// - [x] open-page
// - [x] open-link
// - [ ] reward-ox
// - [ ] reward-chest

/**
 * @param {NotificationInApp} notif
 * @param {string} [response]
 */
async function handleRead(notif, response) {
    const lang = langManager.curr['notifications']['in-app'];

    const callbackID = `notif-${notif.data.ID}`;
    user.tcp.Send({
        action: 'global-message',
        ID: notif.data.ID,
        callbackID: callbackID
    });
    const tcpResponse = await user.tcp.WaitForCallback(callbackID);
    if (tcpResponse !== 'ok') {
        const title = lang['popup-error-title'];
        const text = lang['popup-error-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }
}

/** @param {NotificationInApp} notif */
function handleOpenPageOrURL(notif) {
    if (typeof notif.data.data !== 'string') {
        return handleRead(notif);
    }

    user.interface.notificationsInApp.Close();

    if (notif.data.action === 'open-page' && user.interface.IsPage(notif.data.data)) {
        //@ts-ignore
        user.interface.ChangePage(notif.data.data);
    } else if (notif.data.action === 'open-link' && Linking.canOpenURL(notif.data.data)) {
        Linking.openURL(notif.data.data);
    }

    return handleRead(notif);
}

/** @param {NotificationInApp} notif */
function handleRespond(notif) {
    const lang = langManager.curr['notifications']['in-app'];

    user.interface.notificationsInApp.Close();
    user.interface.screenInput.Open(lang['global-message-input'], '', async (response) => {
        const callbackID = `notif-${notif.data.ID}`;
        user.tcp.Send({
            action: 'global-message',
            ID: notif.data.ID,
            response: response,
            callbackID: callbackID
        });
        const result = await user.tcp.WaitForCallback(callbackID);
        if (result !== 'ok') {
            const title = lang['popup-error-title'];
            const text = lang['popup-error-text'];
            user.interface.popup.Open('ok', [ title, text ]);
            return;
        }

        const title = lang['popup-responded-title'];
        const text = lang['popup-responded-text'];
        user.interface.popup.Open('ok', [ title, text ]);
        handleRead(notif, response);
    }, true);
}

/** @param {NotificationInApp} notif */
function handleClaim(notif) {
    // TODO: Claim reward
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
    }

    else if (notif.data.action === 'respond') {
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
                <Button
                    style={styles.globalMessageButton}
                    color='main1'
                    fontSize={14}
                    onPress={() => handleRead(notif)}
                >
                    {lang['global-message-close']}
                </Button>
            </View>
        );
    }

    else if (notif.data.action === 'reward-ox' || notif.data.action === 'reward-chest') {
        return (
            <View style={styles.globalMessageButtons}>
                {/** TODO: Show chest or ox images + count */}
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

/**
 * @param {object} props
 * @param {NotificationInApp} props.notif
 * @param {number} props.index
 * @returns {JSX.Element}
 */
function NIA_GlobalMessage({ notif, index }) {
    const title = langManager.GetText(notif.data.message);

    return (
        <View style={styles.globalMessageContainer}>
            <View style={styles.globalMessageText}>
                <Text fontSize={16}>{title}</Text>
            </View>

            <View style={styles.globalMessageButtons}>
                {renderButtons(notif)}
            </View>
        </View>
    );
}

export default NIA_GlobalMessage;
