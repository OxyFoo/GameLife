import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { DateToFormatString } from 'Utils/Date';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 *
 * @typedef {import('Data/News').New} New
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('Class/Quests/DailyQuest').ClaimType} ClaimType
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 *
 * @typedef {Object} NewsPropsType
 * @property {StyleViewProp} style
 */

/** @type {NewsPropsType} */
const NewsProps = {
    style: {}
};

class BackNews extends React.Component {
    state = {
        /** @type {Array<New>} */
        pagesNews: [],

        claimIndex: -1,
        claimDay: 0,
        /** @type {string | null} */
        claimDate: null,

        /** @type {Array<MyQuest>} */
        quests: []
    };

    /** @type {Symbol | null} */
    listenerMyQuests = null;

    /** @type {Symbol | null} */
    listenerDailyQuest = null;

    /** @type {Symbol | null} */
    listenerActivities = null;

    /** @param {NewsPropsType} props */
    constructor(props) {
        super(props);

        if (dataManager.news.news.length) {
            try {
                const news = dataManager.news.news;
                this.state.pagesNews.push(...news);
            } catch (e) {
                user.interface.console?.AddLog('error', 'News loading failed: ' + e);
            }
        }
    }

    componentDidMount() {
        this.updateMyQuests(user.quests.myquests.allQuests.Get());
        this.updateDailyQuest(user.quests.dailyquest.claimsList.Get());
        this.listenerMyQuests = user.quests.myquests.allQuests.AddListener(this.updateMyQuests);
        this.listenerDailyQuest = user.quests.dailyquest.claimsList.AddListener(this.updateDailyQuest);
        this.listenerActivities = user.activities.allActivities.AddListener(() =>
            this.updateMyQuests(user.quests.myquests.allQuests.Get())
        );
    }

    componentWillUnmount() {
        user.quests.dailyquest.claimsList.RemoveListener(this.listenerDailyQuest);
        user.quests.myquests.allQuests.RemoveListener(this.listenerMyQuests);
        user.activities.allActivities.RemoveListener(this.listenerActivities);
    }

    /** @param {Array<MyQuest>} newQuests */
    updateMyQuests = (newQuests) => {
        const quests = newQuests
            .filter((quest) => user.quests.myquests.GetDays(quest).find((d) => d.state === 'filling' && d.progress < 1))
            .slice(0, 2);
        this.setState({ quests });
    };

    /** @param {Array<ClaimType>} claimLists */
    updateDailyQuest = (claimLists) => {
        let claimDay = 0;
        let claimDate = null;

        const claimIndex = user.quests.dailyquest.GetCurrentClaimIndex();
        const claimList = claimLists[claimIndex];

        if (claimIndex !== -1) {
            for (claimDay = 0; claimDay < claimList.daysCount; claimDay++) {
                if (!claimList.claimed.includes(claimDay + 1)) break;
            }
            claimDate = DateToFormatString(new Date(claimList.start + 'T00:00:00'))
                .split('/')
                .slice(0, 2)
                .join('/');
        }

        this.setState({ claimIndex, claimDay, claimDate });
    };

    goToQuestsPage = () => {
        user.interface.ChangePage('myquests');
    };
}

BackNews.prototype.props = NewsProps;
BackNews.defaultProps = NewsProps;

export default BackNews;
