import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { Random } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Interface/Components').Button} Button
 * @typedef {import('Interface/Components').SimpleContainer} SimpleContainer
 */

const DailyQuestProps = {
    /** @type {StyleProp} */
    style: {}
};

class DailyQuestBack extends React.Component {
    state = {
        /** @type {number | null} */
        selectedSkill: null
    }

    /** @type {Symbol | null} */
    dailyQuestListener = null;

    /** @type {SimpleContainer | null} */
    refContainer = null;

    /** @type {Button | null} */
    refOpenStreakPopup = null;

    componentDidMount() {
        this.update();
        this.dailyQuestListener = user.quests.nonzerodays.claimsList.AddListener(this.update);
    }

    componentWillUnmount() {
        user.quests.nonzerodays.claimsList.RemoveListener(this.dailyQuestListener);
    }

    update = () => {
        const worstStats = user.statsKey
            .map(key => ({ key, value: user.stats[key] }))
            .sort((a, b) => a.value.totalXP - b.value.totalXP)
            .slice(0, 3);

        const totalSkills = 50;
        const selectedSkill = dataManager
            .skills.Get()
            .filter(skill => skill.XP > 0)
            .sort((skillA, skillB) => {
                const aStats = worstStats
                    .map(stat => skillA.Stats[stat.key])
                    .reduce((a, b) => a + b, 0);
                const bStats = worstStats
                    .map(stat => skillB.Stats[stat.key])
                    .reduce((a, b) => a + b, 0);
                return bStats - aStats;
            })
            .map(skill => ({
                ID: skill.ID,
                name: skill.Name.fr,
                value: worstStats
                    .map(s => skill.Stats[s.key])
                    .reduce((a, b) => a + b, 0)
            }))
            .slice(0, totalSkills)
            .sort(() => Random(-1, 1, 2));

        this.setState({
            selectedSkill: selectedSkill.at(0).ID
        });
    }
}

DailyQuestBack.prototype.props = DailyQuestProps;
DailyQuestBack.defaultProps = DailyQuestProps;

export default DailyQuestBack;
