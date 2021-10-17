import * as React from 'react';
import { GetTimeToTomorrow } from '../Functions/Functions';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';

class Dailyquest extends React.Component {
    constructor(props) {
        super(props);

        this.daily_states = user.quests.dailyTodayCheck();
    }
    state = {
        informations: false,
        enable: false,
        time: GetTimeToTomorrow(),
        selectedSkill1: undefined,
        selectedSkill2: undefined,
        enable: user.quests.daily.length > 0
    }

    componentDidMount() {
        this.daily_bonus = user.quests.dailyGetBonusCategory();
        this.SKILLS = user.getSkills();
        this.interval = setInterval(this.loop, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    loop = () => {
        this.setState({ time: GetTimeToTomorrow() });
    }

    back = () => {
        if (this.state.informations) {
            this.setState({ informations: false });
        } else if (!this.state.enable && user.quests.daily.length) {
            this.setState({ enable: true });
        } else {
            user.backPage();
        }
    }

    // EDIT

    changeSkill1 = (skillID) => {
        if (typeof(skillID) !== 'number') {
            this.setState({ selectedSkill1: undefined });
            return;
        }
        this.setState({ selectedSkill1: skillID });
    }

    changeSkill2 = (skillID) => {
        if (typeof(skillID) !== 'number') {
            this.setState({ selectedSkill2: undefined });
            return;
        }
        this.setState({ selectedSkill2: skillID });
    }

    saveClick = () => {
        const valid = this.state.selectedSkill1 !== undefined && this.state.selectedSkill2 !== undefined;
        if (!valid) {
            const title = langManager.curr['dailyquest']['alert-notfill-title'];
            const text = langManager.curr['dailyquest']['alert-notfill-text'];
            user.openPopup('ok', [ title, text ]);
        } else {
            if (this.state.selectedSkill1 == this.state.selectedSkill2) {
                const title = langManager.curr['dailyquest']['alert-same-title'];
                const text = langManager.curr['dailyquest']['alert-same-text'];
                user.openPopup('ok', [ title, text ]);
            } else {
                this.save();
            }
        }
    }

    save = () => {
        const skillID1 = this.state.selectedSkill1;
        const skillID2 = this.state.selectedSkill2;
        user.quests.dailyOnChange(skillID1, skillID2)
        this.saved();
    }

    saved = () => {
        const enable = () => { this.setState({ enable: true }); }
        const title = langManager.curr['dailyquest']['alert-success-title'];
        const text = langManager.curr['dailyquest']['alert-success-text'];
        user.openPopup('ok', [ title, text ], enable, false);
    }

    // DAILY QUESTS

    edit = () => {
        if (user.quests.dailyAlreadyChanged()) {
            const title = langManager.curr['dailyquest']['alert-warn-title'];
            const text = langManager.curr['dailyquest']['alert-warn-text'];
            user.openPopup('ok', [ title, text ]);
            return;
        }
        this.setState({
            enable: false,
            selectedSkill1: undefined,
            selectedSkill2: undefined
        });
    }

    info = () => {
        this.setState({ informations: true });
    }
}

export default Dailyquest;