import { Linking, StyleSheet } from 'react-native';
import AppControl from 'react-native-app-control';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text } from 'Interface/Components';
import { env } from 'Utils/Env';

/**
 * @typedef {keyof import('Managers/LangManager').Lang['app']['loading-error-message']} ErrorMessages
 */

const handleDiscordRedirection = () => {
    Linking.openURL(env.LINK_DISCORD).catch((err) => {
        user.interface.console?.AddLog('error', `[Loading ErrorHandle] Failed to open Discord link: ${err}`);
    });
};

/** @param {ErrorMessages} message */
const handleLoadingError = (message) => {
    const lang = langManager.curr['app'];

    const discordMessage = lang['help-discord-message'];

    // Check if the message contains the Discord link placeholder
    if (!discordMessage.includes('{') || !discordMessage.includes('}')) {
        user.interface.console?.AddLog(
            'warn',
            '[Loading ErrorHandle] Discord link not found in the message, please update the language file.'
        );

        user.interface.ChangePage('display', {
            args: {
                icon: 'close-filled',
                text: lang['loading-error-message'][message],
                button: lang['loading-error-button'],
                action: AppControl.Restart
            },
            storeInHistory: false
        });
        return;
    }

    // Split the message into parts before, middle, and after the Discord link
    const messageBeforeDiscord = discordMessage.split('{')[0];
    const messageMiddleDiscord = discordMessage.split('{')[1].split('}')[0];
    const messageAfterDiscord = discordMessage.split('}')[1];

    user.interface.ChangePage('display', {
        args: {
            icon: 'close-filled',
            text: lang['loading-error-message'][message],
            additionalContent: (
                <Text fontSize={16} style={styles.additionalContent}>
                    {messageBeforeDiscord}
                    <Text
                        style={styles.additionalContentLink}
                        fontSize={16}
                        color='main1'
                        onPress={handleDiscordRedirection}
                    >
                        {messageMiddleDiscord}
                    </Text>
                    {messageAfterDiscord}
                </Text>
            ),
            button: lang['loading-error-button'],
            action: AppControl.Restart
        },
        storeInHistory: false
    });
};

const styles = StyleSheet.create({
    additionalContent: {
        textAlign: 'left'
    },
    additionalContentLink: {
        marginBottom: -4 // TODO: Why ?
    }
});

export { handleLoadingError };
