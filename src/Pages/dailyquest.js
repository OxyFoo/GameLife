import * as React from 'react';
import { GetTimeToTomorrow } from '../Functions/Functions';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';

class Dailyquest extends React.Component {
    state = {
        enable: false,
        time: GetTimeToTomorrow(),
        selectedCategory1: undefined,
        selectedCategory2: undefined
    }

    componentDidMount() {
        this.setState({ enable: user.daily.length === 2 });
        this.CATEGORIES = user.getSkillCategories();
        this.interval = setInterval(this.loop, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    loop = () => {
        this.setState({ time: GetTimeToTomorrow() });
    }

    back = () => {
        if (!this.state.enable && user.daily.length === 2) {
            this.setState({ enable: true });
        } else {
            user.backPage();
        }
    }

    // EDIT

    changeCat1 = (categoryIndex) => {
        if (typeof(categoryIndex) !== 'number') {
            this.setState({ selectedCategory1: undefined });
            return;
        }
        const category = this.CATEGORIES[categoryIndex];
        this.setState({ selectedCategory1: category });
    }

    changeCat2 = (categoryIndex) => {
        if (typeof(categoryIndex) !== 'number') {
            this.setState({ selectedCategory2: undefined });
            return;
        }
        const category = this.CATEGORIES[categoryIndex];
        this.setState({ selectedCategory2: category });
    }

    saveClick = () => {
        const valid = this.state.selectedCategory1 !== undefined && this.state.selectedCategory2 !== undefined;
        if (!valid) {
            const title = langManager.curr['dailyquest']['alert-notfill-title'];
            const text = langManager.curr['dailyquest']['alert-notfill-text'];
            user.openPopup('ok', [ title, text ]);
        } else {
            if (this.state.selectedCategory1 == this.state.selectedCategory2) {
                const title = langManager.curr['dailyquest']['alert-same-title'];
                const text = langManager.curr['dailyquest']['alert-same-text'];
                user.openPopup('ok', [ title, text ]);
            } else if (user.daily.length === 2 && (user.daily[0] != this.state.selectedCategory1 || user.daily[1] != this.state.selectedCategory2)) {
                const event = (button) => {
                    if (button === 'yes') {
                        setTimeout(this.save, 100);
                    }
                }
                const title = langManager.curr['dailyquest']['alert-warn-title'];
                const text = langManager.curr['dailyquest']['alert-warn-text'];
                user.openPopup('yesno', [ title, text ], event, false);
            } else {
                this.save();
            }
        }
    }

    save = () => {
        const category1 = this.state.selectedCategory1;
        const category2 = this.state.selectedCategory2;
        user.daily = [ category1, category2 ];
        user.dailyDate = new Date();
        user.saveData();
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
        this.setState({
            enable: false,
            selectedCategory1: user.daily[0],
            selectedCategory2: user.daily[1]
        });
    }
}

export default Dailyquest;