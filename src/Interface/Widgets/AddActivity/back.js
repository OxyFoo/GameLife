import React from 'react';

import dataManager from 'Managers/DataManager';

/**
 * @typedef {import('react-native').FlatList} FlatList
 *
 * @typedef {import('Data/Skills').Skill} Skill
 * @typedef {import('./types').ItemSkill} ItemSkill
 * @typedef {import('./types').EnrichedSkill} EnrichedSkill
 * @typedef {import('./types').ItemCategory} ItemCategory
 *
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Interface/Components/InputText/Thin').InputTextThin} InputTextThin
 * @typedef {import('Interface/Widgets').ActivityPanel} ActivityPanel
 *
 * @typedef {Object} BackActivityPropsType
 * @property {number | null} args.categoryID
 * @property {number | null} args.time
 * @property {Array<number>} args.preselectedSkillsIDs If only one skill is passed, it will be selected by default
 */

/** @type {BackActivityPropsType} */
const BackActivityProps = {
    categoryID: null,
    time: null,
    preselectedSkillsIDs: []
};

class BackActivity extends React.Component {
    state = {
        /** @type {number | null} */
        selectedSkill: null,

        /** @type {number} Duration of selected activity (in minutes) */
        duration: 60
    };

    /** @param {BackActivityPropsType} props */
    constructor(props) {
        super(props);

        // If default skills is defined and contains only one skill
        if (props.preselectedSkillsIDs.length === 1) {
            const skill = dataManager.skills.GetByID(props.preselectedSkillsIDs[0]);
            if (skill !== null) {
                this.state.selectedSkill = skill.ID;
            }
        }
    }

    /** @param {number} skillID */
    selectSkill = (skillID) => {
        this.setState({ selectedSkill: skillID });
    };

    unSelectSkill = () => {
        this.setState({ selectedSkill: null });
    };

    /** @param {number} duration */
    onChangeDuration = (duration) => {
        this.setState({ duration });
    };
}

BackActivity.defaultProps = BackActivityProps;
BackActivity.prototype.props = BackActivityProps;

export default BackActivity;
