import * as React from 'react';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { getDates, getDurations } from '../Functions/Functions';

class Activity extends React.Component {
    constructor(props) {
        super(props);

        this.STATS = [ "sag", "int", "con", "for", "end", "agi", "dex" ];
        this.SELECTED = typeof(props.args['activity']) !== 'undefined';

        if (this.SELECTED) {
            const activity = props.args['activity'];
            const skillID = activity.skillID;
            const skill = user.getSkillByID(skillID);

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
                selectedActivity: activity,
                selectedDateKey: 0,
                selectedTimeKey: 0
            }
        } else {
            const MAX_DAYS = 2;
            const STEP_MINUTES = 15;
            const TOTAL_HOUR_DURATION = 2;
            const SKILLS = user.getSkills();

            this.CATEGORIES = user.getSkillCategories();
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

    back = () => { user.backPage(); }
    valid = () => {
        if (typeof(this.state.selectedSkill) === 'undefined') {
            console.warn("Il faut remplir les champs");
        } else {
            const skillID = this.state.selectedSkill.skillID;
            const date = this.DATES[this.state.selectedDateKey].fulldate;
            const duration = this.DURATION[this.state.selectedTimeKey].duration;
            if (!user.addActivity(skillID, date, duration)) {
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
                user.remActivity(this.state.selectedSkill);
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
                skills: user.getSkills(),
                selectedCategory: undefined,
                selectedActivity: undefined
            });
            return;
        }
        const category = this.CATEGORIES[categoryIndex];
        this.setState({
            skills: user.getSkills(category.value),
            selectedCategory: category,
            selectedActivity: undefined
        });
    }
    changeSkill = (skillID) => {
        const activity = { skillID: skillID };
        const skill = user.getSkillByID(skillID);

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
            selectedActivity: activity,
            selectedCategory: category,
            skills: user.getSkills(category.value)
        });
    }
    changeDate = (key) => {
        this.setState({ selectedDateKey: key });
    }
    changeDuration = (key) => {
        this.setState({ selectedTimeKey: key });
    }
}

export default Activity;