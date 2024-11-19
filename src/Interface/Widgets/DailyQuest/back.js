import * as React from 'react';

import RenderPopup from './RewardPopup';
import user from 'Managers/UserManager';

import { DateFormat } from 'Utils/Date';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const DailyQuestProps = {
    /** @type {StyleProp} */
    style: {}
};

class DailyQuestBack extends React.Component {
    state = {
        dailyQuest: user.dailyQuest.today.Get(),

        claimIndex: -1,
        claimDay: 0,
        claimDate: null
    };

    /** @type {Symbol | null} */
    dailyQuestListener = null;

    /** @type {Symbol | null} */
    claimListsListener = null;

    componentDidMount() {
        this.updateClaimList();

        this.dailyQuestListener = user.dailyQuest.today.AddListener((dailyQuest) => {
            this.setState({ dailyQuest });
        });
        this.claimListsListener = user.dailyQuest.claimsList.AddListener(this.updateClaimList);
    }

    componentWillUnmount() {
        user.dailyQuest.today.RemoveListener(this.dailyQuestListener);
        user.dailyQuest.claimsList.RemoveListener(this.claimListsListener);
    }

    updateClaimList = () => {
        let claimDay = 0;
        let claimDate = null;

        const claimIndex = user.dailyQuest.GetCurrentClaimIndex();
        const claimLists = user.dailyQuest.claimsList.Get();
        const claimList = claimLists[claimIndex];
        if (claimIndex !== -1) {
            for (claimDay = 0; claimDay < claimList.daysCount; claimDay++) {
                if (!claimList.claimed.includes(claimDay + 1)) break;
            }
            if (!user.dailyQuest.IsCurrentList(claimList)) {
                claimDate = DateFormat(new Date(claimList.start + 'T00:00:00'), 'DD/MM/YYYY');
            }
        }

        this.setState({
            dailyQuest: user.dailyQuest.today.Get(),
            claimIndex,
            claimDay,
            claimDate
        });
    };

    openRewardPopup = () => {
        user.interface.popup?.Open({
            content: <RenderPopup />,
            cancelable: true
        });
    };
}

DailyQuestBack.prototype.props = DailyQuestProps;
DailyQuestBack.defaultProps = DailyQuestProps;

export default DailyQuestBack;
