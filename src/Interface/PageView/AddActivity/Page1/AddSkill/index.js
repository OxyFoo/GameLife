import React from 'react';
import { Linking, View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, CheckBox, Text } from 'Interface/Components';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('Types/Data/App/Skills').Skill} Skill
 * @typedef {import('Types/Data/App/Skills').GeneratedSkill} GeneratedSkill
 */

/**
 * Create a new skill using ZapGPT
 * @param {string} skillName
 */
async function CreateSkill(skillName) {
    const lang = langManager.curr['activity'];

    const response = await user.server2.tcp.SendAndWait({
        action: 'create-skill',
        skillName: skillName
    });

    if (response === 'not-sent' || response === 'timeout' || response === 'interrupted') {
        user.interface.console?.AddLog('error', `[CreateSkill] Skill creation failed: ${skillName} (${response})`);
        return;
    }

    if (response.status !== 'create-skill' || response.result === 'error') {
        user.interface.console?.AddLog('error', `[CreateSkill] Skill creation failed: ${skillName}`);
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-error-title'],
                message: lang['alert-error-message'].replace('{}', 'create-skill-error')
            }
        });
        return;
    }

    if (response.result === 'feature-disabled') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-skill-feature-disabled-title'],
                message: lang['alert-skill-feature-disabled-message']
            }
        });
        return;
    }

    if (response.result === 'skill-already-exists') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-skill-already-exist-title'],
                message: lang['alert-skill-already-exist-message']
            }
        });
        return;
    }

    if (response.result === 'cant-generate') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-skill-cant-generate-title'],
                message: lang['alert-skill-cant-generate-message']
            }
        });
        return;
    }

    const { generatedSkill, encryptedSkill } = response.result;

    return new Promise((resolve) => {
        user.interface.popup?.Open({
            content: <PopupConfirmSkill generatedSkill={generatedSkill} encryptedSkill={encryptedSkill} />,
            cancelable: false,
            callback: resolve
        });
    });
}

/**
 * @param {object} props
 * @param {GeneratedSkill} props.generatedSkill
 * @param {string} props.encryptedSkill
 */
function PopupConfirmSkill({ generatedSkill, encryptedSkill }) {
    const lang = langManager.curr['activity'];
    const langStats = langManager.curr['statistics']['names'];
    const langPopup = langManager.curr['modal'];

    const [loading, setLoading] = React.useState(false);
    const [shareUsername, setShareUsername] = React.useState(true);

    const skillDetails = user.experience.statsKey
        .filter((key) => generatedSkill.Stats[key] > 0)
        .map((key) => {
            return langStats[key] + ': ' + generatedSkill.Stats[key];
        })
        .join('\n');

    const colors = [themeManager.GetColor('primary'), themeManager.GetColor('secondary')];

    const changeUserShare = () => {
        if (loading) {
            return;
        }
        setShareUsername(!shareUsername);
    };

    const valid = () => {
        setLoading(true);
        AddSkill(encryptedSkill, shareUsername).then(() => {
            setLoading(false);
            ClosePopup();
        });
    };

    return (
        <View>
            <Text style={styles.title}>{lang['skill-add-title']}</Text>
            <Text style={styles.skillTitle}>{langManager.GetText(generatedSkill.Name)}</Text>
            <Text style={styles.details} color='secondary'>
                {skillDetails}
            </Text>
            {lang['skill-add-informations'].map((info, index) => (
                <Text
                    key={`info-${index}`}
                    style={[
                        styles.info,
                        {
                            color: colors[index % colors.length]
                        }
                    ]}
                >
                    {info}
                </Text>
            ))}

            <Text style={styles.question}>{lang['skill-add-confirmation']}</Text>

            <View style={styles.shareUsername}>
                <CheckBox color='white' value={shareUsername} onPress={changeUserShare} />
                <Text
                    style={styles.shareUsernameText}
                    containerStyle={styles.shareUsernameTextContainer}
                    color='white'
                    onPress={changeUserShare}
                >
                    {lang['skill-add-share-username']}
                </Text>
            </View>

            <View style={styles.buttonsDiscord}>
                <Button style={styles.buttonDiscord} appearance='outline' icon={'discord'} onPress={DiscordPress} />
            </View>

            <View style={styles.buttons}>
                <Button style={styles.button} appearance='outline' onPress={ClosePopup} loading={loading}>
                    {langPopup['btn-no']}
                </Button>
                <Button style={styles.button} onPress={valid} loading={loading}>
                    {langPopup['btn-yes']}
                </Button>
            </View>
        </View>
    );
}

function DiscordPress() {
    Linking.openURL('https://discord.com/invite/FfJRxjNAwS');
}

async function ClosePopup() {
    user.interface.popup?.Close('close');
}

/**
 * @param {string} encryptedSkill
 * @param {boolean} shareUsername
 */
async function AddSkill(encryptedSkill, shareUsername) {
    const lang = langManager.curr['activity'];

    const response = await user.server2.tcp.SendAndWait({
        action: 'add-skill',
        encryptedSkill: encryptedSkill,
        shareUsername
    });

    if (response === 'not-sent' || response === 'timeout' || response === 'interrupted') {
        user.interface.console?.AddLog('error', `[AddSkill] Skill addition failed: ${encryptedSkill} (${response})`);
        return;
    }

    if (response.status !== 'add-skill' || response.result === 'error') {
        user.interface.console?.AddLog('error', `[AddSkill] Skill addition failed: ${encryptedSkill}`);
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-error-title'],
                message: lang['alert-error-message'].replace('{}', 'add-skill-error')
            }
        });
        return;
    }

    if (response.result === 'skill-already-exists') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-skill-already-exist-title'],
                message: lang['alert-skill-already-exist-message']
            }
        });
        return;
    }

    user.interface.popup?.OpenT({
        type: 'ok',
        data: {
            title: lang['alert-skill-added-title'],
            message: lang['alert-skill-added-message']
        }
    });
}

export { CreateSkill };
