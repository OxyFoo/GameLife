import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import AchievementCard from './cards';
import BackAchievements from './back';
import langManager from 'Managers/LangManager';

import { Text, Button, Icon } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class Achievements extends BackAchievements {
    render() {
        const lang = langManager.curr['achievements'];
        const { title, achievements, allAchievementsProgression, ascending } = this.state;

        return (
            <View style={styles.parent}>
                <PageHeader style={styles.pageHeader} title={title} onBackPress={this.onBackPress} />

                <View style={styles.banner}>
                    <View style={styles.bannerTitleContainer}>
                        <Icon icon='success' size={28} color='main1' />
                        <Text style={styles.bannerTitleText} color='main1'>
                            {allAchievementsProgression}
                        </Text>
                    </View>

                    <Button
                        style={styles.bannerSortButton}
                        appearance='uniform'
                        color='transparent'
                        onPress={this.onSortPress}
                    >
                        <Text style={styles.bannerSortButtonText} color='secondary'>
                            {lang['sort-text'] + lang['sort-list'][0]}
                        </Text>
                        <Icon icon='filter-outline' size={28} color='main1' angle={ascending ? 180 : 0} />
                    </Button>
                </View>

                <FlatList
                    style={styles.flatlist}
                    data={achievements}
                    keyExtractor={(item) => `achievement-${item.ID}`}
                    renderItem={(props) => <AchievementCard {...props} />}
                />
            </View>
        );
    }
}

export default Achievements;
