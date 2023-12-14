import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackQuests from './back';
import langManager from 'Managers/LangManager';

import { Button, Container, Page, Text } from 'Interface/Components';
import { NonZeroDay, QuestsList } from 'Interface/Widgets';

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
                <QuestsList style={styles.quest} />
            </Page>
        );
    }
}

export default Quests;
