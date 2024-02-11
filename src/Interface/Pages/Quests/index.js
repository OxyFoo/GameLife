import * as React from 'react';

import styles from './style';
import BackQuests from './back';

import { Page } from 'Interface/Components';
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
                <NonZeroDay style={styles.quest} />
                <MyQuestsList style={styles.quest} />
                <TodoList style={styles.quest} />
            </Page>
        );
    }
}

export default Quests;
