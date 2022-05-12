import * as React from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

import BackTask from './back';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';
import themeManager from '../../../Managers/ThemeManager';

import { Button, Icon, Input, Page, Text } from '../../Components';
import { PageHeader, TaskElement, TaskSchedule } from '../../Widgets';

class Task extends BackTask {
    renderSubtasks = () => {
        if (!this.state.subtasks.length) return null;

        const background = { backgroundColor: themeManager.GetColor('main1') };

        return (
            <View style={[styles.subtasksContainer, background]}>
                <FlatList
                    style={{ height: 'auto' }}
                    data={this.state.subtasks}
                    keyExtractor={(item, index) => 'task-' + index.toString()}
                    renderItem={({ item, index }) => (
                        <TaskElement
                            subtask={item}
                            onSubtaskEdit={(checked, title) => this.onEditSubtask(index, checked, title)}
                            onSubtaskDelete={() => this.onDeleteSubtask(index)}
                        />
                    )}
                />
            </View>
        );
    }
    renderCommentary = () => {
        const lang = langManager.curr['task'];
        const backgroundCard = { backgroundColor: themeManager.GetColor('backgroundCard') };

        if (this.state.description === null) {
            return (
                <Button
                    style={styles.comButton}
                    onPress={this.onAddComment}
                    color='main1'
                    fontSize={14}
                >
                    {lang['button-commentary']}
                </Button>
            );
        }
        return (
            <View>
                {/* Comment title */}
                <Text style={styles.sectionTitle} fontSize={22}>{lang['title-commentary']}</Text>

                {/* Comment content */}
                <TouchableOpacity
                    style={[styles.commentPanel, backgroundCard]}
                    activeOpacity={.6}
                    onPress={this.onEditComment}
                    onLongPress={this.onRemComment}
                >
                    <Text style={styles.description}>{this.state.description}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const lang = langManager.curr['task'];
        const { action, deadline, repeatMode, repeatDays, error } = this.state;

        let btnText = lang['button-add'];
        let btnColor = 'main2';
        if (action === 'edit') {
            btnText = lang['button-save'];
            btnColor = 'success';
        }
        if (action === 'remove') {
            btnText = lang['button-remove'];
            btnColor = 'danger';
        }

        const initValues = action === 'new' ? null : [deadline, repeatMode, repeatDays];

        return (
            <Page onStartShouldSetResponder={this.keyboardDismiss}>
                <PageHeader
                    onBackPress={() => user.interface.BackPage()}
                />

                <Input
                    style={styles.top}
                    label={lang['input-title']}
                    text={this.state.title}
                    maxLength={128}
                    onChangeText={this.onChangeTitle}
                />
                <Text fontSize={16} color='error'>{error}</Text>

                <TaskSchedule
                    initValues={initValues}
                    onChange={this.onChangeSchedule}
                />

                <View style={[styles.row, styles.sectionTitle]}>
                    <Text fontSize={22}>{lang['title-subtasks']}</Text>
                    <Icon icon='add' onPress={this.addSubtask} />
                </View>
                <this.renderSubtasks />
                <this.renderCommentary />

                <Button
                    style={styles.button}
                    color={btnColor}
                    onPress={this.onButtonPress}
                    enabled={error.length === 0}
                >
                    {btnText}
                </Button>
            </Page>
        )
    }
}

const styles = StyleSheet.create({
    top: {
        marginTop: 32,
        marginBottom: 6
    },
    sectionTitle: {
        marginTop: 32,
        marginBottom: 12
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    subtasksContainer: {
        padding: 28,
        paddingTop: 14,
        borderRadius: 8
    },
    comButton: {
        height: 48,
        marginTop: 48,
        marginHorizontal: 20
    },
    commentPanel: {
        padding: '5%',
        borderRadius: 24
    },
    description: {
        fontSize: 16,
        textAlign: 'left'
    },
    button: {
        marginTop: 48
    }
});

export default Task;