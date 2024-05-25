import * as React from 'react';

import RenderPopup from './RewardPopup';
import user from 'Managers/UserManager';

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
        dailyQuest: user.quests.dailyquest.today.Get()
    }

    /** @type {Symbol | null} */
    dailyQuestListener = null;

    /** @type {React.RefObject<SimpleContainer>} */
    refContainer = React.createRef();

    /** @type {React.RefObject<Button>} */
    refOpenStreakPopup = React.createRef();

    gradientPos1 = { x: 0, y: -2 };
    gradientPos2 = { x: 1, y: 2 };

    componentDidMount() {
        this.update();
        this.dailyQuestListener = user.quests.dailyquest.today.AddListener(this.update);
    }

    componentWillUnmount() {
        user.quests.dailyquest.today.RemoveListener(this.dailyQuestListener);
    }

    update = () => {
        this.setState({
            dailyQuest: user.quests.dailyquest.today.Get()
        });
    }

    openRewardPopup = () => {
        user.interface.popup.Open('custom', RenderPopup, undefined, true, false);
    }
}

DailyQuestBack.prototype.props = DailyQuestProps;
DailyQuestBack.defaultProps = DailyQuestProps;

export default DailyQuestBack;
