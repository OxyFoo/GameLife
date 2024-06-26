import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackQuests from './back';

import { DailyQuest, MyQuestsList, TodoList } from 'Interface/Widgets';

class Quests extends BackQuests {
    render() {
        return (
            <View style={styles.page}>
                <DailyQuest ref={this.refDailyQuest} style={styles.quest} />
                <MyQuestsList ref={this.refMyQuestsList} style={styles.quest} />
                <TodoList ref={this.refTodoList} style={styles.quest} />
            </View>
        );
    }
}

export default Quests;
