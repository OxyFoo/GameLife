import * as React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { TodoList } from 'Interface/Widgets';
import { Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('Class/Todoes').Task} Task
 */

const SectionTasksProps = {
    onChange: () => {}
};

class SectionTasks extends React.Component {
    state = {
        /** @type {Array<Task>} */
        tasks: []
    };

    refHelp1 = null;

    /** @param {Array<Task>} tasks */
    SetTasks = (tasks) => {
        this.setState({ tasks: [...tasks] });
    };
    GetTasks = () => {
        return this.state.tasks;
    };

    addTask = () => {
        let { tasks: tasks } = this.state;

        if (tasks.length >= 20) {
            const title = langManager.curr['todo']['alert-taskslimit-title'];
            const text = langManager.curr['todo']['alert-taskslimit-text'];
            user.interface.popup.Open('ok', [title, text]);
            return;
        }

        tasks.push({
            checked: false,
            title: ''
        });

        this.setState({ tasks });
        this.props.onChange();
    };
    onEditTask = (index, checked, title) => {
        let { tasks: tasks } = this.state;

        tasks.splice(index, 1, {
            checked: checked,
            title: title
        });

        this.setState({ tasks });
        this.props.onChange();
    };
    onDeleteTask = (index) => {
        let { tasks: tasks } = this.state;

        tasks.splice(index, 1);

        this.setState({ tasks });
        this.props.onChange();
    };

    render() {
        const lang = langManager.curr['todo'];

        return (
            <View ref={(ref) => (this.refHelp1 = ref)}>
                <View style={[styles.row, styles.sectionTitle]}>
                    <Text fontSize={22}>{lang['title-tasks']}</Text>
                    <Icon icon='add' onPress={this.addTask} />
                </View>

                <this.renderTasks />
            </View>
        );
    }

    renderTasks = () => {
        if (!this.state.tasks.length) return null;

        const background = {
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        // Flatlist is not working properly (scroll height breaks)
        return (
            <View style={[styles.tasksContainer, background]}>
                {this.state.tasks.map((task, index) => (
                    <TodoList.TaskElement
                        key={'todo-' + index.toString()}
                        task={task}
                        onTaskEdit={(checked, title) => this.onEditTask(index, checked, title)}
                        onTaskDelete={() => this.onDeleteTask(index)}
                    />
                ))}
            </View>
        );
    };
}

SectionTasks.prototype.props = SectionTasksProps;
SectionTasks.defaultProps = SectionTasksProps;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    sectionTitle: {
        marginTop: 32,
        marginBottom: 12
    },
    tasksContainer: {
        padding: 28,
        paddingTop: 14,
        borderRadius: 8
    }
});

export default SectionTasks;
