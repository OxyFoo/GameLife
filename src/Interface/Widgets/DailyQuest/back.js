import * as React from 'react';

import RenderPopup from './RewardPopup';
import user from 'Managers/UserManager';

import { DateFormat } from 'Utils/Date';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Data/User/DailyQuests').DailyQuestDay} DailyQuestDay
 */

const DailyQuestProps = {
    /** @type {StyleProp} */
    style: {}
};

class DailyQuestBack extends React.Component {
    state = {
        dailyQuest: user.dailyQuest.today.Get(),

        claimListIndex: -1,
        /** @type {DailyQuestDay | null} */
        claimDay: null,
        claimStreak: 0,
        /** @type {string | null} */
        claimDate: null
    };

    /** @type {Symbol | null} */
    dailyQuestListener = null;

    /** @type {Symbol | null} */
    claimListsListener = null;

    componentDidMount() {
        this.dailyQuestListener = user.dailyQuest.today.AddListener(this.updateClaimList);
        this.claimListsListener = user.dailyQuest.claimsList.AddListener(this.updateClaimList);
    }

    componentWillUnmount() {
        user.dailyQuest.today.RemoveListener(this.dailyQuestListener);
        user.dailyQuest.claimsList.RemoveListener(this.claimListsListener);
    }

    updateClaimList = () => {
        const claimListIndex = user.dailyQuest.GetCurrentClaimIndex();

        /** @type {this['state']['claimDay']} */
        let claimDay = null;

        /** @type {this['state']['claimStreak']} */
        let claimStreak = 0;

        /** @type {this['state']['claimDate']} */
        let claimDate = null;

        const claimLists = user.dailyQuest.claimsList.Get();

        if (claimListIndex !== -1) {
            const claimList = claimLists[claimListIndex];
            const claimDays = user.dailyQuest.GetClaimDays(claimList);
            const claimDayIndex = user.dailyQuest.GetLastUnclaimedDayIndex(claimList);

            claimDay = claimDays.find((day) => day.index === claimDayIndex) || null;
            claimStreak = user.dailyQuest.GetStreak(claimList);
            if (!user.dailyQuest.IsCurrentList(claimList)) {
                claimDate = DateFormat(new Date(claimList.start + 'T00:00:00'), 'DD/MM/YYYY');
            }
        } else {
            const claimDays = user.dailyQuest.GetClaimDays(null);
            claimDay = claimDays[0];
        }

        this.setState({
            dailyQuest: user.dailyQuest.today.Get(),
            claimListIndex,
            claimDay,
            claimStreak,
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
