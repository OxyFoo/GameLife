import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

class BackCalendar extends React.Component {
    state = {
        activities: user.activities.getByDate().reverse(),
        currDate: new Date(),
        showDateTimePicker: ''
    };

    back = () => { user.backPage(); }
    addSkill = () => {
        if (dataManager.skills.getAll().length <= 1) {
            console.warn("Aucun skill !");
            return;
        }
        user.changePage('activity');
    }
    skill_click = (activity) => { user.changePage('activity', {'activity': activity}); }
    skill_remove = (activity) => {
        const remove = (button) => {
            if (button === 'yes') {
                user.activities.Remove(activity);
                this.onChangeDateTimePicker(this.state.currDate);
            }
        }
        const title = langManager.curr['calendar']['alert-remove-title'];
        const text = langManager.curr['calendar']['alert-remove-text'];
        user.openPopup('yesno', [ title, text ], remove);
    }

    showDTP = () => { this.setState({ showDateTimePicker: 'date' }); }
    hideDTP = () => { this.setState({ showDateTimePicker: '' }); }
    onChangeDateTimePicker = (date) => {
        const activities = user.activities.getByDate(date).reverse();
        this.hideDTP();
        this.setState({ activities: activities, currDate: date });
    }

    dailyQuest = () => {
        user.changePage('dailyquest');
    }
}

export default BackCalendar;