import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import BackNews from './back';
import RenderNew from './renderNews';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import Text from 'Interface/Components/Text';
import Icon from 'Interface/Components/Icon';
import Button from 'Interface/Components/Button';
import Swiper from 'Interface/Components/Swiper';
import DayClock from 'Interface/Components/DayClock';
import Separator from 'Interface/Components/Separator';
import { RenderItemMemo } from 'Interface/Widgets/NonZeroDay/element';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('react-native').ListRenderItem<MyQuest>} ListRenderItemMyQuest
 */

class News extends BackNews {
    renderRecapMyquests = () => {
        const lang = langManager.curr['quests'];
        const { quests } = this.state;

        return (
            <View style={styles.mqContainer}>
                <Text style={styles.mqTitle}>{lang['container-title']}</Text>
                <FlatList
                    data={quests}
                    renderItem={this.renderMyQuestElement}
                    ItemSeparatorComponent={this.renderMyQuestSeparator}
                    keyExtractor={item => `news-myquest-${item.created}`}
                />
            </View>
        );
    }

    /** @type {ListRenderItemMyQuest} */
    renderMyQuestElement = ({ item: quest }) => {
        const questsDays = user.quests.myquests.GetDays(quest);
        const currentDay = new Date().getDay() - 1 + 7 % 7;
        const item = questsDays[currentDay];
        const onPress = () => {
            user.interface.ChangePage('activity', { skills: quest.skills }, true);
        };

        return (
            <Button style={styles.mqItem} onPress={onPress}>
                <Text>{quest.title}</Text>
                <View style={styles.headerStreak}>
                    <DayClock
                        style={styles.mqDayClock}
                        day={item.day}
                        isToday={item.isToday}
                        state={item.state}
                        fillingValue={item.fillingValue}
                    />
                    <Text style={styles.streak}>
                        {quest.maximumStreak.toString()}
                    </Text>
                    <Icon icon='flame' />
                </View>
            </Button>
        );
    }

    renderMyQuestSeparator = () => (
        <Separator.Horizontal style={styles.mqSeparator} />
    )

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
