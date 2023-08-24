import React from 'react';
import { Animated, FlatList } from 'react-native';

import styles from './style';
import BackTasks from './back';
import TaskElement from './taskElement';
import SubtaskElement from './subtaskElement';
import langManager from 'Managers/LangManager';

import { Container, Button, Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Class/Tasks').Task} Task
 */

const TasksProps = {
    /** @type {StyleProp} Style of tasks container */
    style: {}
}

class Tasks extends BackTasks {
    static TaskElement = TaskElement;
    static SubtaskElement = SubtaskElement;

    renderSelection = () => {
        const { draggedItem, mouseY } = this.state;
        if (draggedItem === null) return null;

        const translate = {
            transform: [
                { translateY: mouseY }
            ]
        };

        return (
            <Animated.View style={[styles.selection, translate]}>
                <TaskElement
                    style={{ marginTop: 0 }}
                    task={draggedItem}
                />
            </Animated.View>
        );
    }

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
        const { scrollable, tasks } = this.state;

        return (
            <Container
                style={this.props.style}
                styleContainer={styles.tasksContainer}
                type='static'
                icon='add'
                text={lang['container-title']}
                onLayout={this.onLayout}
                onIconPress={this.addTask}
            >
                {this.renderSelection()}
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