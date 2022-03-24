import * as React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import BackTasks from '../PageBack/Tasks';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { PageHeader } from '../Widgets';
import { Button, Container, Page, TaskElement, Text } from '../Components';

class Tasks extends BackTasks {
    render() {
        const lang = langManager.curr['tasks'];
        const { adState } = this.state;

        return (
            <Page canScrollOver={false} bottomOffset={96}>
                <PageHeader
                    onBackPress={() => user.interface.BackPage()}
                />

                <Button.Ad
                    style={styles.spaceBottom}
                    state={adState}
                    onPress={this.watchAd}
                />

                <Container
                    styleContainer={styles.tasksContainer}
                    type='static'
                    icon='add'
                    text={lang['container-title']}
                    onIconPress={this.addTask}
                >
                    <FlatList
                        style={{ height: 'auto' }}
                        data={this.tasks}
                        keyExtractor={(item, index) => 'task-' + index.toString()}
                        renderItem={({ item }) => (
                            <TaskElement task={item} onTaskCheck={this.onTaskCheck} />
                        )}
                        ListEmptyComponent={() => (
                            <>
                                <Text style={styles.emptyText}>{lang['tasks-empty-title']}</Text>
                                <Button onPress={this.addTask} color='main1'>{lang['tasks-empty-button']}</Button>
                            </>
                        )}
                    />
                </Container>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    tasksContainer: { padding: 28, paddingTop: 14 },
    spaceBottom: { marginBottom: 32 },
    emptyText: { marginBottom: 12 },
    adButton: { justifyContent: 'space-between', borderRadius: 14 },
    adText: { marginRight: 6 },
    adIcon: { flexDirection: 'row' }
});

export default Tasks;