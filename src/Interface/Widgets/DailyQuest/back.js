import * as React from 'react';

import RenderPopup from './RewardPopup';
import user from 'Managers/UserManager';

import { DateFormat } from 'Utils/Date';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Data/User/DailyQuests').DailyQuestDay} DailyQuestDay
 * @typedef {import('Data/User/DailyQuests').DailyQuestData} DailyQuestData
 */

const DailyQuestProps = {
    /** @type {StyleProp} */
    style: {}
};

class DailyQuestBack extends React.Component {
    state = {
        dailyQuest: user.dailyQuest.currentQuest.Get(),

        /** @type {DailyQuestData | null} */
        claimList: null,
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
        this.dailyQuestListener = user.dailyQuest.currentQuest.AddListener(this.updateClaimList);
        this.claimListsListener = user.dailyQuest.claimsList.AddListener(this.updateClaimList);
    }

    componentWillUnmount() {
        user.dailyQuest.currentQuest.RemoveListener(this.dailyQuestListener);
        user.dailyQuest.claimsList.RemoveListener(this.claimListsListener);
    }

    updateClaimList = () => {
        const dailyQuest = user.dailyQuest.currentQuest.Get();
        const claimLists = user.dailyQuest.claimsList.Get();
        const claimListIndex = user.dailyQuest.GetCurrentClaimIndex();
        const claimList = claimListIndex === -1 ? null : claimLists[claimListIndex];

        /** @type {this['state']['claimDay']} */
        let claimDay = null;

        /** @type {this['state']['claimStreak']} */
        let claimStreak = 0;

        /** @type {this['state']['claimDate']} */
        let claimDate = null;

        if (claimList !== null) {
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
            dailyQuest,
            claimList,
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
