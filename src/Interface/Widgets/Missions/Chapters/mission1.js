import React from 'react';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { AddActivity } from '../../../PageView/AddActivity';
import { Sleep } from 'Utils/Functions';
import { TIME_STEP_MINUTES } from 'Utils/Activities';
import { GetLocalTime, RoundTimeTo } from 'Utils/Time';

async function StartMission1() {
    const mission = user.missions.GetCurrentMission().mission;
    if (mission === null || !user.interface.screenTuto || !user.interface.navBar) {
        user.interface.console?.AddLog('error', '[Missions.Start]: Mission, screenTuto or navBar is null', {
            mission,
            screenTutoIsSet: !!user.interface.screenTuto,
            navBarIsSet: !!user.interface.navBar
        });
        return;
    }

    const lang = langManager.curr['missions']['content'];

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
}

export default StartMission1;
