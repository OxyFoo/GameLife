import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { GetDate } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * 
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const NewsProps = {
    /** @type {StyleViewProp} */
    style: {}
};

class BackNews extends React.Component {
    state = {
        pagesNews: [],

        claimIndex: -1,
        claimDay: 0,
        /** @type {string | null} */
        claimDate: null
    }

    constructor(props) {
        super(props);

        if (dataManager.news.news.length) {
            try {
                const news = dataManager.news.news;
                this.state.pagesNews.push(...news);
            } catch (e) {
                user.interface.console.AddLog('error', 'News loading failed: ' + e);
            }
        }
    }

    componentDidMount() {
        this.update();
        this.listener = user.quests.nonzerodays.claimsList.AddListener(this.update);
    }

    componentWillUnmount() {
        user.quests.nonzerodays.claimsList.RemoveListener(this.listener);
    }

    update = () => {
        let claimDay = 0;
        let claimDate = null;

        const claimIndex = user.quests.nonzerodays.GetCurrentClaimIndex();
        const claimLists = user.quests.nonzerodays.claimsList.Get();
        const claimList = claimLists[claimIndex];

        if (claimIndex !== -1) {
            for (claimDay = 0; claimDay <= claimList.daysCount; claimDay++) {
                if (!claimList.claimed.includes(claimDay + 1)) break;
            }
            if (!user.quests.nonzerodays.IsCurrentList(claimList)) {
                claimDate = DateToFormatString(GetDate(claimList.start));
            }
        }

        this.setState({ claimIndex, claimDay, claimDate });
    }

    /** @param {number} index */
    onClaimPress = (index) => {
        this.timeoutToNextClaim = setTimeout(this.update, 500);
    }

    goToQuestsPage = () => user.interface.ChangePage('quests');
}

BackNews.prototype.props = NewsProps;
BackNews.defaultProps = NewsProps;

export default BackNews;
