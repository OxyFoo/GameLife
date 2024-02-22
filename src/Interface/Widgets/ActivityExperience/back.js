import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Round } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {{ key: string, name: string, value: number }} Stat
 */

const ActivityExperienceProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {string} Replace {} by "+ X XP" */
    title: '{}',

    /** @type {number} Skill ID or 0 to unselect */
    skillID: 0,

    /** @type {number} Duration of the activity in minutes */
    duration: 60,

    /** @type {boolean} */
    compact: false
};

class ActivityExperienceBack extends React.Component {
    state = {
        /** @type {string} */
        title: '',

        /** @type {Array<Stat>} */
        data: []
    };

    componentDidMount() {
        this.updateSkill();
    }

    componentDidUpdate(prevProps) {
        const { skillID, duration } = this.props;

        if (prevProps.skillID !== skillID || prevProps.duration !== duration) {
            this.updateSkill();
            return true;
        }

        return false;
    }

    updateSkill = () => {
        const { title, data } = this.state;
        const { skillID, duration } = this.props;

        const skill = dataManager.skills.GetByID(skillID);
        if (skill === null) {
            if (title.length > 0 || data.length > 0) {
                this.setState({ title: '', data: [] });
            }
            return;
        }

        const XPamount = Round(skill.XP * (duration / 60), 1);
        const XPtext = langManager.curr['level']['xp'];

        /** @type {Stat[]} */
        const newData = user.statsKey
            .filter(stat => skill.Stats[stat] > 0)
            .map(statKey => ({
                key: statKey,
                name: langManager.curr['statistics']['names'][statKey],
                value: Round(skill.Stats[statKey] * (duration / 60), 2)
            }));

        const titleXP = `+ ${XPamount} ${XPtext}`;
        const newTtitle = this.props.title.replace('{}', titleXP);
        this.setState({ title: newTtitle, data: newData });
    }
}

ActivityExperienceBack.prototype.props = ActivityExperienceProps;
ActivityExperienceBack.defaultProps = ActivityExperienceProps;

export default ActivityExperienceBack;
