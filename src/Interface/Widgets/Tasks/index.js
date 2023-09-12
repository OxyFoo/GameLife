import React from 'react';
import { FlatList } from 'react-native';

import styles from './style';
import BackTasks from './back';
import TaskElement from './Elements/task';
import SubtaskElement from './Elements/subtask';
import TaskSelection from './Elements/taskSelection';

import langManager from 'Managers/LangManager';

import { Container, Button, Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 */

const TasksProps = {
    /** @type {StyleProp} Style of tasks container */
    style: {}
}

class Tasks extends BackTasks {
    static TaskElement = TaskElement;
    static SubtaskElement = SubtaskElement;

    renderItem = ({ item }) => {
        const { draggedItem } = this.state;

        const styleOpacity = { opacity: 1 };
        if (draggedItem !== null && item.Title === draggedItem.Title) {
            styleOpacity.opacity = .25;
        }

        return (
            <TaskElement
                style={styleOpacity}
                task={item}
                onTaskCheck={this.onTaskCheck}
                onDrag={() => this.onDrag(item)}
            />
        );
    }

    renderEmpty = () => {
        const lang = langManager.curr['tasks'];

        return (
            <>
                <Text style={styles.emptyText}>{lang['tasks-empty-title']}</Text>
                <Button onPress={this.addTask} color='main1'>{lang['tasks-empty-button']}</Button>
            </>
        );
    }

    render() {
        const lang = langManager.curr['tasks'];
        const {
            scrollable, tasks,
            draggedItem, mouseY,
            undoEnabled
        } = this.state;

        /** @type {Icons} */
        const containerIcon = undoEnabled ? 'undo' : 'add';
        const containerAction = undoEnabled ? this.undo : this.addTask;

        return (
            <Container
                style={this.props.style}
                styleContainer={styles.tasksContainer}
                type='static'
                icon={containerIcon}
                text={lang['container-title']}
                onIconPress={containerAction}
            >
                <TaskSelection
                    draggedItem={draggedItem}
                    mouseY={mouseY}
                />

                <FlatList
                    ref={ref => this.refFlatlist = ref}

                    onScroll={this.onScroll}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}

                    data={tasks}
                    scrollEnabled={scrollable}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderEmpty}
                />
            </Container>
        );
    }
}

Tasks.prototype.props = TasksProps;
Tasks.defaultProps = TasksProps;

export default Tasks;