import * as React from 'react';

import styles from './style';
import BackQuests from './back';

import { Page } from 'Interface/Components';
import { NonZeroDay, MyQuestsList, TodoList, DailyQuest } from 'Interface/Widgets';

class Quests extends BackQuests {
    render() {
        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.page}
                isHomePage
                canScrollOver
            >
                <DailyQuest style={styles.quest} />
                <NonZeroDay ref={this.refNonZeroDay} style={styles.quest} />
                <MyQuestsList ref={this.refMyQuestsList} style={styles.quest} />
                <TodoList ref={this.refTodoList} style={styles.quest} />
            </Page>
        );
    }
}

export default Quests;
