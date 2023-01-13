import { Animated } from 'react-native';

import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';
import dataManager from '../../../Managers/DataManager';

import { Page, PageBack } from '../../Components';
import { GetTime } from '../../../Utils/Time';
import { IsUndefined } from '../../../Utils/Functions';
import { SpringAnimation } from '../../../Utils/Animations';
import Notifications from '../../../Utils/Notifications';

/**
 * @typedef {import('../../../Class/Activities').Activity} Activity
 */

class BackActivity extends PageBack {
    constructor(props) {
        super(props);

        const visualisationMode = this.props.args.hasOwnProperty('activity');
        const isSetSkillID = this.props.args.hasOwnProperty('skillID');

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
            categories.push({ ID: ID, name: Name, icon: Icon });
        }
        if (categories.length % 6 !== 0) {
            categories.push(...Array(6 - (categories.length % 6)).fill(0));
        }

        const skills = dataManager.skills.skills.map(skill => ({ id: skill.ID, value: dataManager.GetText(skill.Name) }));

        let activitySchedule;
        if (visualisationMode) activitySchedule = [ activity.startTime, activity.duration ];
        else if (user.tempSelectedTime !== null) activitySchedule = [ user.tempSelectedTime, 15 ];

        let selectedSkill = { id: 0, value: '' };
        if (isSetSkillID) {
            const { skillID } = this.props.args;
            const skill = dataManager.skills.GetByID(skillID);
            selectedSkill = { id: skillID, value: dataManager.GetText(skill.Name) };
        }
        if (visualisationMode) {
            selectedSkill = { id: activity.skillID, value: dataManager.GetText(skill.Name) };
        }

        this.state = {
            categories: categories,
            selectedCategory: visualisationMode ? skill.CategoryID : null,
            skills: skills,

            visualisationMode: visualisationMode,
            startnowMode: 0,
            selectedSkill: selectedSkill,
            posY: 0,
            animPosY: new Animated.Value(visualisationMode ? 0 : 1),

            comment: visualisationMode ? activity.comment || '' : '',
            activityStart: visualisationMode ? activity.startTime : null,
            activityDuration: visualisationMode ? activity.duration : 15,
            ActivitySchedule: activitySchedule
        }
    }

    componentDidMount() {
        const isSetSkillID = this.props.args.hasOwnProperty('skillID');
        if (isSetSkillID) {
            SpringAnimation(this.state.animPosY, 0).start();
        }
    }

    selectCategory = (ID, checked) => {
        const filter = skill => !checked || skill.CategoryID === ID;
        const maper = skill => ({ id: skill.ID, value: dataManager.GetText(skill.Name) });
        const skills = dataManager.skills.skills.filter(filter).map(maper);
        this.setState({ selectedCategory: checked ? ID : null, skills: skills });
    }
    selectActivity = (skill) => {
        let callback = () => SpringAnimation(this.state.animPosY, 0).start();

        if (skill === null) {
            skill = { id: 0, value: '' };
            callback = () => {
                this.refPage.GotoY(0);
                SpringAnimation(this.state.animPosY, 1).start();
            }
        }

        this.setState({ selectedSkill: skill }, callback);
    }

    onChangeMode = (index) => {
        this.setState({ startnowMode: index === 1 }, () => {
            if (index === 1) this.refPage.GotoY(0);
        });
    }

    getCategoryName = () => {
        let output = langManager.curr['activity']['input-activity'];
        const selectedCategory = this.state.categories.find(category => category.ID === this.state.selectedCategory);
        if (!IsUndefined(selectedCategory)) {
            output = selectedCategory.name;
        }
        return output;
    }

    onChangeSchedule = (startTime, duration) => {
        this.setState({ activityStart: startTime, activityDuration: duration });
    }

    onChangeStateSchedule = (opened) => {
        if (opened) {
            this.refPage.GotoY(-300);
            this.refPage.DisableScroll();
        } else {
            this.refPage.EnableScroll();
        }
    }

    onAddComment = () => {
        if (this.state.comment !== '') return;
        const save = () => this.state.visualisationMode && this.AddActivity();
        const callback = (text) => {
            this.setState({ comment: text }, save);
        };
        const titleCommentary = langManager.curr['activity']['title-commentary'];
        user.interface.screenInput.Open(titleCommentary, '', callback, true);
    }
    onEditComment = () => {
        const titleCommentary = langManager.curr['activity']['title-commentary']
        const save = () => this.state.visualisationMode && this.AddActivity();
        /** @param {string} text */
        const callback = (text) => {
            this.setState({ comment: text }, save);
        };
        user.interface.screenInput.Open(titleCommentary, this.state.comment, callback, true);
    }
    onRemComment = () => {
        const title = langManager.curr['activity']['alert-remcomment-title'];
        const text = langManager.curr['activity']['alert-remcomment-text'];
        const save = () => this.state.visualisationMode && this.AddActivity();
        const callback = (btn) => btn === 'yes' && this.setState({ comment: '' }, save);
        user.interface.popup.Open('yesno', [ title, text ], callback);
    }

    AddActivity = () => {
        const skillID = this.state.selectedSkill.id;
        const { activityStart, activityDuration, comment } = this.state;

        const addState = user.activities.Add(skillID, activityStart, activityDuration, comment);
        if (addState === 'added') {
            Notifications.Evening.RemoveToday();
            const text = langManager.curr['activity']['display-activity-text'];
            const button = langManager.curr['activity']['display-activity-button'];
            user.interface.ChangePage('display', { 'icon': 'success', 'text': text, 'button': button }, true);
            user.RefreshStats();
        } else if (addState === 'edited') {
            //user.interface.BackPage();
        } else if (addState === 'notFree') {
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