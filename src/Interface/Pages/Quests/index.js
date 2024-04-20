import * as React from 'react';

import styles from './style';
import BackQuests from './back';

import { Page } from 'Interface/Global';
import { NonZeroDay, MyQuestsList, TodoList } from 'Interface/Widgets';

class Quests extends BackQuests {
    render() {
        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.page}
                isHomePage
                canScrollOver
            >
                <NonZeroDay ref={this.refNonZeroDay} style={styles.quest} />
                <MyQuestsList ref={this.refMyQuestsList} style={styles.quest} />
                <TodoList ref={this.refTodoList} style={styles.quest} />
            </Page>
        );
    }
}

export default Quests;
