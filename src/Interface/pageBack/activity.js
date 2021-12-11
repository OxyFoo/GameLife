import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import { getDates, getDurations } from '../../Functions/Time';

class BackActivity extends React.Component {
    constructor(props) {
        super(props);

        let categories = [];
        for (let i = 0; i < dataManager.skills.skillsCategories.length; i++) {
            const category = dataManager.skills.skillsCategories[i];
            const ID = category.ID;
            const Icon = dataManager.skills.getXmlByLogoID(category.LogoID);
            categories.push({ ID: ID, icon: Icon, checked: false });
        }
        this.state = {
            categories: categories
        }
        return;

        // OLD

        this.STATS = [ "sag", "int", "con", "for", "end", "agi", "dex" ];
        this.SELECTED = typeof(props.args['activity']) !== 'undefined';

        if (this.SELECTED) {
            const activity = props.args['activity'];
            const skillID = activity.skillID;
            const skill = dataManager.skills.getByID(skillID);

            const date = new Date(activity.startDate);
            const dateTxt = date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
            const timeTxt = parseInt(activity.duration/60) + ':' + parseInt(activity.duration%60);
            const duration = activity.duration;

            this.CATEGORIES = [];
            this.DATES = [{ key: 0, value: dateTxt, fulldate: date }];
            this.DURATION = [{ key: 0, value: timeTxt, duration: duration }];

            const category = { key: 0, value: skill.Category };

            this.state = {
                skills: [],

                selectedCategory: category,
                selectedSkill: activity,
                selectedDateKey: 0,
                selectedTimeKey: 0
            }
        } else {
            const MAX_DAYS = 2;
            const STEP_MINUTES = 15;
            const TOTAL_HOUR_DURATION = 4;
            const SKILLS = dataManager.skills.getAsObj();

            this.CATEGORIES = dataManager.skills.getCategories();
            this.DATES = getDates(MAX_DAYS, STEP_MINUTES);
            this.DURATION = getDurations(TOTAL_HOUR_DURATION, STEP_MINUTES);
            this.state = {
                skills: SKILLS,
        
                selectedCategory: undefined,
                selectedSkill: undefined,
                selectedDateKey: 0,
                selectedTimeKey: 3
            }
        }
    }

    selectCategory = (ID, checked) => {
        let { categories } = this.state;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].ID === ID) {
                categories[i].checked = checked;
            } else {
                categories[i].checked = false;
            }
        }
        this.setState({ categories: categories });
    }

    back = () => { user.backPage(); }
    valid = () => {
        if (typeof(this.state.selectedSkill) === 'undefined') {
            const title = langManager.curr['calendar']['alert-notfill-title'];
            const text = langManager.curr['calendar']['alert-notfill-text'];
            user.openPopup('ok', [ title, text ]);
        } else {
            const skillID = this.state.selectedSkill.skillID;
            const date = this.DATES[this.state.selectedDateKey].fulldate;
            const duration = this.DURATION[this.state.selectedTimeKey].duration;
            if (!user.activities.Add(skillID, date, duration)) {
                const title = langManager.curr['calendar']['alert-wrongtiming-title'];
                const text = langManager.curr['calendar']['alert-wrongtiming-text'];
                user.openPopup('ok', [ title, text ]);
                return;
            }
            this.back();
        }
    };
    trash = () => {
        const remove = (button) => {
            if (button === 'yes') {
                user.activities.Remove(this.state.selectedSkill);
                this.back();
            }
        }
        const title = langManager.curr['calendar']['alert-remove-title'];
        const text = langManager.curr['calendar']['alert-remove-text'];
        user.openPopup('yesno', [ title, text ], remove);
    }

    changeCat = (categoryIndex) => {
        if (typeof(categoryIndex) !== 'number') {
            this.setState({
                skills: dataManager.skills.getAsObj(),
                selectedCategory: undefined,
                selectedSkill: undefined
            });
            return;
        }
        const category = this.CATEGORIES[categoryIndex];
        this.setState({
            skills: dataManager.skills.getAsObj(category.value),
            selectedCategory: category,
            selectedSkill: undefined
        });
    }
    changeSkill = (skillID) => {
        const activity = { skillID: skillID };
        const skill = dataManager.skills.getByID(skillID);

        // Get category ID
        let category;
        for (let i = 0; i < this.CATEGORIES.length; i++) {
            const cat = this.CATEGORIES[i];
            if (cat.value === skill.Category) {
                category = cat;
                break;
            }
        }

        this.setState({
            selectedSkill: activity,
            selectedCategory: category,
            skills: dataManager.skills.getAsObj(category.value)
        });
    }
    changeDate = (key) => {
        this.setState({ selectedDateKey: key });
    }
    changeDuration = (key) => {
        this.setState({ selectedTimeKey: key });
    }
}

export default BackActivity;