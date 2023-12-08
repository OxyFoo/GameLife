import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackQuests from './back';
import langManager from 'Managers/LangManager';

import { Button, Container, Page, Text } from 'Interface/Components';
import { QuestsList } from 'Interface/Widgets';

class Quests extends BackQuests {
    render() {
        return (
            <Page ref={ref => this.refPage = ref} isHomePage canScrollOver>
                <QuestsList />
            </Page>
        );
    }
}

export default Quests;
