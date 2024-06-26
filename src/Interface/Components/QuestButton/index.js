import * as React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import QuestButtonBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button } from 'Interface/Components';

class QuestButton extends QuestButtonBack {
    render() {
        const langTimes = langManager.curr['dates']['names'];
        const { streakCount } = this.state;
        const { style, quest } = this.props;
        if (quest === null) return null;

        const timeHour = Math.floor(quest.schedule.duration / 60);
        const timeMinute = quest.schedule.duration % 60;

        const { title } = quest;
        let titleText = `${title.length > 10 ? title.slice(0, 12) + '...' : title}`;
        let timeText = '';
        if (timeHour > 0 || timeMinute > 0) {
            if (timeHour > 0) {
                timeText += `${timeHour}${langTimes['hours-min']}`;
            }
            if (timeMinute > 0) {
                timeText += ` ${timeMinute}${langTimes['minutes-min']}`;
            }
        }

        return (
            <LinearGradient
                style={[styles.item, style]}
                colors={[
                    themeManager.GetColor('backgroundCard', { opacity: 0.45 }),
                    themeManager.GetColor('backgroundCard', { opacity: 0.2 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Button style={styles.content} appearance='uniform' color='transparent' onPress={this.openQuest}>
                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <Text style={styles.title}>{titleText}</Text>
                        </View>
                        <View style={styles.headerStreak}>
                            <Text style={styles.streakText2} color='main1'>
                                {'0 / ' + timeText}
                            </Text>
                            <Text style={styles.streakText} color='main2'>
                                {streakCount.toString()}
                            </Text>
                            <Icon icon='flame' color='main2' style={styles.streakIcon} />
                            <Icon icon='arrow-square' color='gradient' angle={90} />
                        </View>
                    </View>
                </Button>
            </LinearGradient>
        );
    }

    renderContentScrollable() {
        const { quest, onDrag } = this.props;
        if (quest === null) return null;

        const { title } = quest;

        return (
            <View style={styles.itemScrollable} onTouchStart={() => onDrag()}>
                <View style={styles.scrollableHeader}>
                    <Icon icon='default' color='main1' />
                    <Text style={styles.scrollableTitle}>{title}</Text>
                </View>
            </View>
        );
    }
}

export { QuestButton };
