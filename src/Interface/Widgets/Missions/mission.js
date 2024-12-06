import React from 'react';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { AddActivity } from '../AddActivity';
import { Sleep } from 'Utils/Functions';
import { TIME_STEP_MINUTES } from 'Utils/Activities';
import { GetLocalTime, RoundTimeTo } from 'Utils/Time';

/**
 * @typedef {import('Data/User/Missions').MissionKeys} MissionKeys
 */

/** @param {MissionKeys} missionName */
async function StartMission(missionName) {
    const mission = user.missions.GetCurrentMission().mission;
    if (mission === null || !user.interface.screenTuto || !user.interface.navBar) {
        user.interface.console?.AddLog('error', '[Missions.Start]: Mission, screenTuto or navBar is null', {
            mission,
            screenTutoIsSet: !!user.interface.screenTuto,
            navBarIsSet: !!user.interface.navBar
        });
        return;
    }

    const langOLD = langManager.curr['missions']['content'][mission.name];
    const lang = langManager.curr['missions']['content'];

    if (missionName !== 'mission1') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: 'PAFINIII',
                message: "C'est pas fini wsh"
            }
        });
        return;
    }

    if (missionName === 'mission1') {
        /** @type {React.RefObject<AddActivity>} */
        const refAddActivity = React.createRef();
        const missionLang = lang['mission1'];
        const missionTexts = missionLang['texts'];

        const tutoStatus = await user.interface.screenTuto.ShowTutorial([
            {
                component: user.interface.navBar.refButtons['addActivity'],
                text: missionTexts['1'],
                execAfter: async () => {
                    user.interface.bottomPanel?.Open({
                        content: <AddActivity ref={refAddActivity} />
                    });

                    await Sleep(500);
                    return false;
                }
            },
            {
                component: () => refAddActivity.current?.nativeRefPage1 ?? null,
                text: missionTexts['2'],
                showNextButton: true,
                execAfter: async () => {
                    await refAddActivity.current?.changeActivity({
                        skillID: 1,
                        addedTime: 0,
                        addedType: 'normal',
                        comment: '',
                        duration: 60,
                        friends: [],
                        startTime: RoundTimeTo(TIME_STEP_MINUTES, GetLocalTime(), 'near'),
                        timezone: 0
                    });
                    await Sleep(500);
                    return false;
                }
            },
            {
                component: () => refAddActivity.current?.refChild2.current?.nativeRefAddView ?? null,
                text: missionTexts['3'],
                showNextButton: true
            },
            {
                component: () => refAddActivity.current?.refChild2.current?.nativeRefStartNowView ?? null,
                text: missionTexts['4'],
                showNextButton: true,
                execAfter: async () => {
                    refAddActivity.current?.unSelectActivity();
                    await Sleep(500);
                    return true;
                }
            },
            {
                component: null,
                showNextButton: true,
                text: missionTexts['5']
            }
        ]);

        if (tutoStatus === 'skipped') {
            refAddActivity.current?.unSelectActivity();
            await user.interface.bottomPanel?.Close();
        }
    } else if (missionName === 'mission2') {
        // TODO: Finish missions
        const missionLang = lang['mission2'];
        const missionTexts = missionLang['texts'];

        user.interface.screenTuto.ShowTutorial([
            {
                component: user.interface.navBar.refButtons['multiplayer'] ?? null,
                text: missionTexts['1'],
                execAfter: () => {
                    user.interface.ChangePage('quests', { missionName }, true);
                    return false;
                }
            }
        ]);
    } else if (missionName === 'mission3') {
        const missionLang = lang['mission3'];
        const missionTexts = missionLang['texts'];

        user.interface.screenTuto.ShowTutorial([
            {
                component: user.interface.navBar.refButtons['multiplayer'] ?? null,
                text: missionTexts['1'],
                execAfter: () => {
                    user.interface.ChangePage('shop', { missionName }, true);
                    return false;
                }
            }
        ]);
    } else if (missionName === 'mission4') {
        const texts = langOLD['texts'];
        user.interface.screenTuto.ShowTutorial([
            {
                component: user.interface.header?.refContainer ?? null,
                text: texts['1'],
                execAfter: () => {
                    user.interface.ChangePage('profile', { missionName }, true);
                    return false;
                }
            }
        ]);
    } else if (missionName === 'mission5') {
    }
}

export default StartMission;
