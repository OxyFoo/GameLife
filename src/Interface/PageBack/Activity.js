import * as React from 'react';
import { Animated } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

import { Activity } from '../../Class/Activities';
import { IsUndefined } from '../../Functions/Functions';
import { SpringAnimation } from '../../Functions/Animations';
import { GetTime } from '../../Functions/Time';

class BackActivity extends React.Component {
    constructor(props) {
        super(props);

        const visualisationMode = this.props.args.hasOwnProperty('activity');

        /**
         * @type {Activity}
         */
        const activity = visualisationMode ? this.props.args.activity : null;
        const skill = visualisationMode ? dataManager.skills.GetByID(activity.skillID) : null;

        let categories = [];
        for (let i = 0; i < dataManager.skills.categories.length; i++) {
            const category = dataManager.skills.categories[i];
            const ID = category.ID;
            const Name = dataManager.GetText(category.Name);
            const Icon = dataManager.skills.GetXmlByLogoID(category.LogoID);
            const Checked = visualisationMode ? skill.CategoryID === ID : false;
            categories.push({ ID: ID, name: Name, icon: Icon, checked: Checked });
        }

        const skills = dataManager.skills.skills.map(skill => ({ id: skill.ID, value: dataManager.GetText(skill.Name) }));
        const emptySkill = { id: 0, value: '' };

        let activitySchedule;
        if (visualisationMode) activitySchedule = [ activity.startTime, activity.duration ];
        else if (user.tempSelectedTime !== null) activitySchedule = [ user.tempSelectedTime, 15 ];

        this.state = {
            categories: categories,
            skills: skills,

            visualisationMode: visualisationMode,
            startnowMode: 0,
            selectedSkill: visualisationMode ? { id: activity.skillID, value: dataManager.GetText(skill.Name) } : emptySkill,
            posY: 0,
            animPosY: new Animated.Value(visualisationMode ? 0 : 1),

            commentary: null,
            activityStart: visualisationMode ? activity.startTime : null,
            activityDuration: visualisationMode ? activity.duration : 15,
            ActivitySchedule: activitySchedule
        }
    }

    selectCategory = (ID, checked) => {
        let { categories } = this.state;
        const newCategories = categories.map(cat => ({
            ...cat, checked: cat.ID === ID ? checked : false
        }));
        this.setState({ categories: newCategories });

        this.selectActivity(null);

        let newActivities = dataManager.skills.GetByCategory(ID);
        if (ID !== 0) newActivities = newActivities.map(skill => ({ id: skill.ID, value: dataManager.GetText(skill.Name) }));
        this.setState({ skills: newActivities });
    }

    selectActivity = (skill) => {
        SpringAnimation(this.state.animPosY, skill === null ? 1 : 0).start();
        if (skill === null) skill = { id: 0, value: '' };
        this.setState({ selectedSkill: skill });
    }

    onChangeMode = (index) => {
        this.setState({ startnowMode: index === 1 });
    }

    getCategoryName = () => {
        let output = langManager.curr['activity']['input-activity'];
        const selectedCategory = this.state.categories.find(category => category.checked);
        if (!IsUndefined(selectedCategory)) {
            output = selectedCategory.name;
        }
        return output;
    }

    onChangeSchedule = (startTime, duration) => {
        this.setState({ activityStart: startTime, activityDuration: duration });
    }

    AddActivity = () => {
        const skillID = this.state.selectedSkill.id;
        const { activityStart, activityDuration } = this.state;
        if (user.activities.Add(skillID, activityStart, activityDuration)) {
            const text = langManager.curr['activity']['display-activity-text'];
            const button = langManager.curr['activity']['display-activity-button'];
            user.interface.ChangePage('display', { 'icon': 'success', 'text': text, 'button': button }, true);
        } else {
            const title = langManager.curr['activity']['alert-wrongtiming-title'];
            const text = langManager.curr['activity']['alert-wrongtiming-text'];
            user.interface.popup.Open('ok', [ title, text ]);
        }
    }
    RemActivity = () => {
        const remove = (button) => {
            if (button === 'yes') {
                user.activities.Remove(this.props.args.activity);
                user.interface.BackPage();
            }
        }
        const title = langManager.curr['activity']['alert-remove-title'];
        const text = langManager.curr['activity']['alert-remove-text'];
        user.interface.popup.Open('yesno', [ title, text ], remove);
    }
    StartActivity = () => {
        const skillID = this.state.selectedSkill.id;
        const startTime = GetTime();

        if (!user.activities.TimeIsFree(startTime, 15)) {
            const title = langManager.curr['activity']['alert-wrongtiming-title'];
            const text = langManager.curr['activity']['alert-wrongtiming-text'];
            user.interface.popup.Open('ok', [ title, text ]);
            return;
        }

        user.activities.currentActivity = [ skillID, startTime ];
        user.LocalSave();
        user.interface.ChangePage('activitytimer', undefined, true);
    }
}

export default BackActivity;