import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackNews from './back';
import RenderNew from './renderNews';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import Text from 'Interface/Components/Text';
import Icon from 'Interface/Components/Icon';
import Swiper from 'Interface/Components/Swiper';
import { RenderItemMemo } from 'Interface/Widgets/NonZeroDay/element';

class News extends BackNews {
    renderRecapMyquests = () => {
        return null;
    }

    renderRecapNZD = () => {
        const lang = langManager.curr['nonzerodays'];
        const { claimDay, claimIndex, claimDate } = this.state;

        if (claimIndex < 0) {
            return null;
        }

        const allClaimLists = user.quests.nonzerodays.claimsList.Get();
        const claimList = allClaimLists[claimIndex];

        if (claimList.claimed.includes(claimList.daysCount)) {
            return null;
        }

        return (
            <View>
                <View style={styles.nzdContainer}>
                    {/* Title */}
                    <Text
                        style={styles.nzdTitle}
                        onPress={this.goToQuestsPage}
                    >
                        {lang['container-title'] + (claimDate !== null && ' - ' + claimDate)}
                    </Text>

                    {/* Claim icon */}
                    <Icon
                        icon='handPress'
                        size={18}
                        color='main1'
                    />
                </View>

                {/* Claim item */}
                <RenderItemMemo
                    style={styles.nzdItem}
                    index={claimDay}
                    claimIndex={claimIndex}
                    handleClaim={this.onClaimPress}
                />
            </View>
        );
    }

    render() {
        const { pagesNews } = this.state;

        const pages = [
            this.renderRecapMyquests(),
            this.renderRecapNZD(),
            ...pagesNews.map(RenderNew)
        ].filter(page => page !== null);

        return (
            <Swiper
                style={this.props.style}
                pages={pages}
            />
        );
    }
};

export default News;
