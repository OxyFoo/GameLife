import React from 'react';
import { Animated, FlatList } from 'react-native';

import user from '../../../../Managers/UserManager';
import langManager from '../../../../Managers/LangManager';
import dataManager from '../../../../Managers/DataManager';
import themeManager from '../../../../Managers/ThemeManager';

import { PageBack } from '../../../Components';
import { SkillToItem } from './types';
import { GetTime } from '../../../../Utils/Time';
import { SpringAnimation } from '../../../../Utils/Animations';
import Notifications from '../../../../Utils/Notifications';

/**
 * @typedef {import('../../../../Data/Skills').Category} Category
 * @typedef {import('./activityPanel').default} ActivityPanel
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * @typedef {{ id: number, name: string, icon: string }} ItemCategory
*/

/**
 * @typedef {import('../back').ItemSkill} ItemSkill
 * @typedef {import('../../../../Data/Skills').Skill} Skill
 * @typedef {import('../../../../Class/Activities').Activity} Activity
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

const ActivityPanelProps = {
    /** @type {number} Top distance of the panel when it's opened */
    topOffset: 0
}

// TODO: selectedSkill, animPosY, refPage

class ActivityPanelBack extends React.Component {
    state = {
        /** @type {number} */
        posY: 0,

        /** @type {Animated.Value} */
        animPosY: new Animated.Value(0),

        /** @type {ItemSkill} */
        selectedSkill: { id: 0, value: '', onPress: () => {} },

        /** @type {string} */
        activityText: langManager.curr['activity']['title-activity'],

        /** @type {'schedule'|'now'} */
        startMode: 'schedule',

        /** @type {string} */
        comment: '',

        /** @type {number|null} */
        activityStart: null,

        /** @type {number} */
        activityDuration: 15
    };

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const valueY = event.nativeEvent.layout?.y || 0;
        if (this.state.posY !== valueY) {
            this.setState({ posY: valueY });
        }
    }

    /** @param {Skill} skill */
    SelectSkill = (skill) => {
        // Skill is already selected
        if (this.state.selectedSkill.id === skill.ID) {
            return;
        }

        this.setState({
            selectedSkill: SkillToItem(skill, this.SelectSkill),
            activityText: dataManager.GetText(skill.Name)
        });
        SpringAnimation(this.state.animPosY, 1).start();
    }

    /** @param {Activity} activity */
    SelectActivity = (activity) => {
        const skill = dataManager.skills.GetByID(activity.SkillID);
        if (skill === null) {
            this.Close();
            return;
        }

        this.setState({
            selectedSkill: SkillToItem(skill, this.SelectSkill),
            activityText: dataManager.GetText(skill.Name)
        });
        SpringAnimation(this.state.animPosY, 1).start();
    }

    Close = () => {
        // Skill is already deselected
        if (this.state.selectedSkill.id === 0) {
            return;
        }

        this.setState({
            selectedSkill: SkillToItem(null),
            activityText: langManager.curr['activity']['title-activity']
        });
        SpringAnimation(this.state.animPosY, 0).start();
    }

    onChangeMode = (index) => {
        const modes = [ 'schedule', 'now' ];
        this.setState({ startMode: modes[index] });
    }

    getCategoryName = () => {
        const checkCategory = cat => cat.id === this.selectedCategory;
        const category = this.categories.find(checkCategory) || null;

        if (category !== null)
            return category.name;
        return langManager.curr['activity']['input-activity'];
    }

    onChangeSchedule = (startTime, duration) => {
        this.setState({ activityStart: startTime, activityDuration: duration });
    }

    onChangeStateSchedule = (opened) => {
        // TODO: Remove ?
        /*if (opened) {
            this.refPage.GotoY(-300);
            this.refPage.DisableScroll();
        } else {
            this.refPage.EnableScroll();
        }*/
    }

    onAddComment = () => {
        if (this.state.comment !== '') return;
        const save = () => this.editMode && this.AddActivity();
        const callback = (text) => {
            this.setState({ comment: text }, save);
        };
        const titleCommentary = langManager.curr['activity']['title-commentary'];
        user.interface.screenInput.Open(titleCommentary, '', callback, true);
    }
    onEditComment = () => {
        const titleCommentary = langManager.curr['activity']['title-commentary']
        const save = () => this.editMode && this.AddActivity();
        /** @param {string} text */
        const callback = (text) => {
            this.setState({ comment: text }, save);
        };
        user.interface.screenInput.Open(titleCommentary, this.state.comment, callback, true);
    }
    onRemComment = () => {
        const title = langManager.curr['activity']['alert-remcomment-title'];
        const text = langManager.curr['activity']['alert-remcomment-text'];
        const save = () => this.editMode && this.AddActivity();
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

ActivityPanelBack.prototype.props = ActivityPanelProps;
ActivityPanelBack.defaultProps = ActivityPanelProps;

export default ActivityPanelBack;