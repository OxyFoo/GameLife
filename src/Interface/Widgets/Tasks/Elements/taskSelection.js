import React from 'react';
import { Animated } from 'react-native';

import styles from './style';
import TaskElement from './task';

/** 
 * @typedef {import('Class/Tasks').Task} Task
 */

const TaskSelectionProps = {
    /** @type {Task|null} */
    draggedItem: null,

    mouseY: new Animated.Value(0)
}

class TaskSelection extends React.Component {
    shouldComponentUpdate(nextProps) {
        const { draggedItem } = this.props;
        return draggedItem !== nextProps.draggedItem;
    }

    render() {
        const { draggedItem, mouseY } = this.props;
        if (draggedItem === null) return null;

        const translate = {
            transform: [
                { translateY: mouseY }
            ]
        };

        return (
            <Animated.View style={[styles.selection, translate]}>
                <TaskElement
                    style={styles.selectionTask}
                    task={draggedItem}
                />
            </Animated.View>
        );
    }
}

TaskSelection.prototype.props = TaskSelectionProps;
TaskSelection.defaultProps = TaskSelectionProps;

export default TaskSelection;