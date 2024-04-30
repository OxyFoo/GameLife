import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackQuests from './back';

import { NonZeroDay, MyQuestsList, TodoList } from 'Interface/Widgets';

class Quests extends BackQuests {
    render() {
        return (
            <View style={styles.page}>
                <NonZeroDay ref={this.refNonZeroDay} style={styles.quest} />
                <MyQuestsList ref={this.refMyQuestsList} style={styles.quest} />
                <TodoList ref={this.refTodoList} style={styles.quest} />
            </View>
        );
    }
}

export default Quests;
