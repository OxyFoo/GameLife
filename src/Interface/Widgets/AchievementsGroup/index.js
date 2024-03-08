import * as React from 'react';
import { TouchableOpacity, FlatList } from 'react-native';

import styles from './style';
import AchievementsGroupBack from './back';
import langManager from 'Managers/LangManager';

import { Button, Separator, Text } from 'Interface/Components';

class AchievementsGroup extends AchievementsGroupBack {
    renderAchievement = ({ item }) => {
        if (item === null) return null;

        const { Name, ID } = item;
        const Title = langManager.GetText(Name);
        return (
            <TouchableOpacity
                onPress={() => this.onAchievementPress(ID)}
                activeOpacity={.6}
            >
                <Text style={styles.text}>{Title}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        const { style } = this.props;
        const { lastAchievements } = this.state;
        const lang = langManager.curr['other'];
        const btnMargin = { marginTop: lastAchievements.length ? 24 : 0 };

        return (
            <>
                <FlatList
                    style={style}
                    data={lastAchievements}
                    renderItem={this.renderAchievement}
                    keyExtractor={(item, index) => 'skill-' + index}
                    ItemSeparatorComponent={() => (
                        <Separator.Horizontal
                            style={styles.separator}
                            color='main1'
                        />
                    )}
                />

                <Button
                    style={[styles.btnSmall, btnMargin]}
                    onPress={this.openAchievements}
                >
                    {lang['widget-achievements-all']}
                </Button>
            </>
        );
    }
}

export default AchievementsGroup;
