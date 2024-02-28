import * as React from 'react';

import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Data/Skills').EnrichedSkill} EnrichedSkill
 */

const SkillsGroupProps = {
    /** @type {StyleProp} */
    style: {}
};

class SkillsGroupBack extends React.Component {
    state = {
        /** @type {Array<EnrichedSkill | null>} 4th is null to show "all" button */
        skills: []
    }

    constructor(props) {
        super(props);

        this.state.skills = user.activities.GetLastSkills(4);
        if (this.state.skills.length >= 4) {
            this.state.skills[3] = null;
        }
    }

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            const skills = user.activities.GetLastSkills(4);
            if (skills.length >= 4) {
                skills[3] = null;
            }
            this.setState({ skills });
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    openSkills = () => user.interface.ChangePage('skills');
    openSkill = (ID) => user.interface.ChangePage('skill', { skillID: ID });
}

SkillsGroupBack.prototype.props = SkillsGroupProps;
SkillsGroupBack.defaultProps = SkillsGroupProps;

export default SkillsGroupBack;
