import * as React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button, Icon } from 'Interface/Components';

/**
 * @typedef {import('Class/Todoes').Todo} Todo
 * @typedef {import('Class/Todoes').Task} Task
 * @typedef {import('react-native').ListRenderItem<Task>} ListRenderItemTask
 *
 * @typedef {Object} SectionTasksPropsType
 * @property {Todo | null} todo
 * @property {(newTodo: Todo) => void} onChangeTodo
 */

/** @type {SectionTasksPropsType} */
const SectionTasksProps = {
    todo: null,
    onChangeTodo: () => {}
};

class SectionTasks extends React.Component {
    /** @param {SectionTasksPropsType} nextProps */
    shouldComponentUpdate(nextProps) {
        const oldTasks = nextProps.todo?.tasks.map((t) => Object.values(t).join('-')).join(',');
        const newTasks = this.props.todo?.tasks.map((t) => Object.values(t).join('-')).join(',');

        return (
            nextProps.todo !== this.props.todo ||
            oldTasks !== newTasks ||
            nextProps.onChangeTodo !== this.props.onChangeTodo
        );
    }

    addTask = () => {
        const lang = langManager.curr['todo'];
        const { todo, onChangeTodo } = this.props;
        if (todo === null) return;

        if (todo.tasks.length >= 20) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-taskslimit-title'],
                    message: lang['alert-taskslimit-text']
                }
            });
            return;
        }

        user.interface.screenInput?.Open({
            label: lang['input-task-placeholder'],
            callback: (title) => {
                if (!title) return;

                todo.tasks.push({
                    checked: false,
                    title
                });
                onChangeTodo(todo);
            }
        });
    };

    /** @param {Task} task */
    editTitleTask = (task) => {
        const lang = langManager.curr['todo'];
        const { todo, onChangeTodo } = this.props;
        if (todo === null) return;

        const index = todo.tasks.indexOf(task);
        if (index === -1) return;

        user.interface.screenInput?.Open({
            label: lang['input-task-placeholder'],
            initialText: task.title,
            callback: (title) => {
                if (!title) return;

                todo.tasks[index] = { ...task, title };
                onChangeTodo(todo);
            }
        });
    };

    /**
     * @param {Task} task
     * @param {boolean} checked
     * @param {string} title
     */
    onEditTask = (task, checked, title) => {
        const { todo, onChangeTodo } = this.props;
        if (todo === null) return;

        const index = todo.tasks.indexOf(task);
        if (index === -1) return;

        todo.tasks[index] = { ...task, checked, title };
        onChangeTodo(todo);
    };

    /** @param {Task} task */
    onDeleteTask = (task) => {
        const lang = langManager.curr['todo'];
        const { todo, onChangeTodo } = this.props;
        if (todo === null) return;

        const index = todo.tasks.indexOf(task);
        if (index === -1) return;

        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-remtask-title'],
                message: lang['alert-remtask-message']
            },
            callback: (btn) => {
                if (btn !== 'yes') return;

                todo.tasks.splice(index, 1);
                onChangeTodo(todo);
            }
        });
    };

    render() {
        const lang = langManager.curr['todo'];
        const { todo } = this.props;
        if (todo === null) return null;

        return (
            <View style={styles.parent}>
                <View style={styles.header}>
                    <Text style={styles.title}>{lang['input-task-title']}</Text>
                    <Button style={styles.smallButton} appearance='uniform' color='transparent' onPress={this.addTask}>
                        <Icon icon='add' size={26} color='gradient' />
                    </Button>
                </View>

                <FlatList
                    data={todo.tasks}
                    extraData={todo}
                    renderItem={this.renderTask}
                    keyExtractor={(item, index) => `task-${item.title}-${index}`}
                    scrollEnabled={false}
                />
            </View>
        );
    }

    /** @type {ListRenderItemTask} */
    renderTask = ({ item }) => {
        return (
            <View style={styles.task}>
                {/* Check button */}
                <Button
                    style={styles.smallButton}
                    appearance='uniform'
                    color='transparent'
                    icon={item.checked ? 'check-filled' : 'uncheck-outline'}
                    fontColor={item.checked ? 'main1' : 'white'}
                    onPress={() => this.onEditTask(item, !item.checked, item.title)}
                />

                {/* Task text */}
                <TouchableOpacity
                    style={styles.taskTextParent}
                    activeOpacity={0.6}
                    onPress={() => this.onEditTask(item, !item.checked, item.title)}
                >
                    <Text style={styles.taskText}>{item.title}</Text>
                </TouchableOpacity>

                {/* Edit / Trash button */}
                <View style={styles.taskDetails}>
                    {/* Edit */}
                    <Button
                        style={styles.smallButton}
                        appearance='uniform'
                        color='transparent'
                        icon='edit-outline'
                        iconSize={20}
                        fontColor='main2'
                        onPress={() => this.editTitleTask(item)}
                    />

                    {/* Remove */}
                    <Button
                        style={styles.smallButton}
                        appearance='uniform'
                        color='transparent'
                        icon='trash-outline'
                        iconSize={20}
                        fontColor='danger'
                        onPress={() => this.onDeleteTask(item)}
                    />
                </View>
            </View>
        );
    };
}

SectionTasks.prototype.props = SectionTasksProps;
SectionTasks.defaultProps = SectionTasksProps;

const styles = StyleSheet.create({
    parent: {
        marginBottom: 128
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    title: {
        textAlign: 'left',
        fontSize: 21
    },
    smallButton: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    },

    task: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    taskTextParent: {
        flex: 1,
        paddingHorizontal: 6
    },
    taskText: {
        textAlign: 'left'
    },
    taskDetails: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default SectionTasks;
