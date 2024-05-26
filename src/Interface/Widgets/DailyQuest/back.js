import * as React from 'react';

import RenderPopup from './RewardPopup';
import user from 'Managers/UserManager';

import { DateFormat } from 'Utils/Date';

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
        dailyQuest: user.quests.dailyquest.today.Get(),

        claimIndex: -1,
        claimDay: 0,
        claimDate: null
    }

    /** @type {Symbol | null} */
    dailyQuestListener = null;

    /** @type {Symbol | null} */
    claimListsListener = null;

    /** @type {React.RefObject<SimpleContainer>} */
    refContainer = React.createRef();

    /** @type {React.RefObject<Button>} */
    refOpenStreakPopup = React.createRef();

    gradientPos1 = { x: 0, y: -2 };
    gradientPos2 = { x: 1, y: 2 };

    componentDidMount() {
        this.updateClaimList();

        this.dailyQuestListener = user.quests.dailyquest.today.AddListener((dailyQuest) => {
            this.setState({ dailyQuest });
        });
        this.claimListsListener = user.quests.dailyquest.claimsList.AddListener(this.updateClaimList);
    }

    componentWillUnmount() {
        user.quests.dailyquest.today.RemoveListener(this.dailyQuestListener);
        user.quests.dailyquest.claimsList.RemoveListener(this.claimListsListener);
    }

    updateClaimList = () => {
        let claimDay = 0;
        let claimDate = null;

        const claimIndex = user.quests.dailyquest.GetCurrentClaimIndex();
        const claimLists = user.quests.dailyquest.claimsList.Get();
        const claimList = claimLists[claimIndex];
        if (claimIndex !== -1) {
            for (claimDay = 0; claimDay <= claimList.daysCount; claimDay++) {
                if (!claimList.claimed.includes(claimDay + 1)) break;
            }
            if (!user.quests.dailyquest.IsCurrentList(claimList)) {
                claimDate = DateFormat(new Date(claimList.start + 'T00:00:00'), 'DD/MM/YYYY');
            }
        }

        this.setState({
            dailyQuest: user.quests.dailyquest.today.Get(),
            claimIndex,
            claimDay,
            claimDate
        });
    }

    openRewardPopup = () => {
        user.interface.popup.Open('custom', RenderPopup, undefined, true, false);
    }
}

DailyQuestBack.prototype.props = DailyQuestProps;
DailyQuestBack.defaultProps = DailyQuestProps;

export default DailyQuestBack;
