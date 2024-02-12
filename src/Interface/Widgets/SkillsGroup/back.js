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
        /** @type {Array<EnrichedSkill>} */
        skills: user.activities.GetLastSkills(3)
    }

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState({ skills: user.activities.GetLastSkills(3) });
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
