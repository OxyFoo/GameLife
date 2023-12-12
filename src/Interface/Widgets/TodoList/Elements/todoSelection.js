import React from 'react';
import { Animated } from 'react-native';

import styles from './style';
import TodoElement from './todo';

/** 
 * @typedef {import('Class/Todoes').Todo} Todo
 */

const TodoSelectionProps = {
    /** @type {Todo | null} */
    draggedItem: null,

    mouseY: new Animated.Value(0)
};

class TodoSelection extends React.Component {
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
                <TodoElement
                    style={styles.selectionTodo}
                    todo={draggedItem}
                />
            </Animated.View>
        );
    }
}

TodoSelection.prototype.props = TodoSelectionProps;
TodoSelection.defaultProps = TodoSelectionProps;

export default TodoSelection;
