import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackNews from './back';
import RenderNew from './renderNews';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import Text from 'Interface/OldComponents/Text';
import Icon from 'Interface/OldComponents/Icon';
import { Swiper } from 'Interface/Components';
import { RenderItemMemo } from 'Interface/Widgets/DailyQuest/RewardPopup/element';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('react-native').ListRenderItem<MyQuest>} ListRenderItemMyQuest
 */

class News extends BackNews {
    render() {
        const { pagesNews } = this.state;

        const pages = [this.renderRecapDailyQuest(), ...pagesNews.map(RenderNew)].filter((page) => page !== null);

        return <Swiper style={this.props.style} pages={pages} delayNext={15} />;
    }

    renderRecapDailyQuest = () => {
        const lang = langManager.curr['daily-quest'];
        const { claimDay, claimIndex, claimDate } = this.state;

        if (claimIndex < 0) {
            return null;
        }

        const allClaimLists = user.quests.dailyquest.claimsList.Get();
        const claimList = allClaimLists[claimIndex];

        if (claimList.claimed.includes(claimList.daysCount)) {
            return null;
        }

        return (
            <View>
                <View style={styles.dqContainer}>
                    {/* Title */}
                    <Text style={styles.dqTitle} onPress={this.goToQuestsPage}>
                        {lang['container-title'] + (claimDate !== null ? ' - ' + claimDate : '')}
                    </Text>

                    {/* Claim icon */}
                    <Icon icon='handPress' size={18} color='main1' />
                </View>

                {/* Claim item */}
                <RenderItemMemo style={styles.dqItem} index={claimDay} claimIndex={claimIndex} />
            </View>
        );
    };
}

export default News;
