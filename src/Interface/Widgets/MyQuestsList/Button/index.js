import * as React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import QuestButtonBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button } from 'Interface/Components';

class MyQuestButton extends QuestButtonBack {
    render() {
        const { timeText, streakCount } = this.state;
        const { style, quest, onLayout, enableQuickAdd } = this.props;
        if (quest === null) return null;

        return (
            <LinearGradient
                style={[styles.item, style]}
                colors={[
                    themeManager.GetColor('backgroundCard', { opacity: 0.45 }),
                    themeManager.GetColor('backgroundCard', { opacity: 0.2 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                onLayout={onLayout}
            >
                <Button
                    style={styles.content}
                    appearance='uniform'
                    color='transparent'
                    onPress={this.openQuest}
                    onLongPress={this.openQuickAddActivity}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    onTouchCancel={this.onTouchEnd}
                    rippleDuration={enableQuickAdd ? 800 : undefined}
                >
                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
                                {quest.title}
                            </Text>
                        </View>
                        <View style={styles.headerStreak}>
                            <Text style={styles.streakText2} color='main1'>
                                {timeText}
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
}

export { MyQuestButton };
