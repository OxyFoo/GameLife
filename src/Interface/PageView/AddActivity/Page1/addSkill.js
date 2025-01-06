import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('Types/Data/App/Skills').Skill} Skill
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
        return null;
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
        return null;
    }

    if (response.result === 'skill-already-exists') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-skill-already-exist-title'],
                message: lang['alert-skill-already-exist-message']
            }
        });
        return null;
    }

    const langStats = langManager.curr['statistics']['names-min'];
    const { generatedSkill, encryptedSkill } = response.result;

    const skillDetails =
        langManager.GetText(generatedSkill.Name) +
        '\n' +
        user.experience.statsKey
            .map((key) => {
                return langStats[key] + ': ' + generatedSkill.Stats[key];
            })
            .join('\n');

    user.interface.popup?.OpenT({
        type: 'yesno',
        data: {
            title: lang['skill-add-title'],
            message: lang['skill-add-message'].replace('{}', skillDetails)
        },
        cancelable: false,
        callback: (result) => {
            if (result !== 'yes') {
                return;
            }

            AddSkill(encryptedSkill);
        }
    });

    return null;
}

/** @param {string} encryptedSkill */
async function AddSkill(encryptedSkill) {
    const lang = langManager.curr['activity'];

    const response = await user.server2.tcp.SendAndWait({
        action: 'add-skill',
        encryptedSkill: encryptedSkill
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
