import React from 'react';
import { Animated } from 'react-native';

import styles from './style';
import { TodoButton } from './index';

/**
 * @typedef {import('Class/Todoes').Todo} Todo
 *
 * @typedef {Object} TodoSelectionPropsType
 * @property {Todo | null} draggedItem
 * @property {Animated.Value} mouseY
 */

/** @type {TodoSelectionPropsType} */
const TodoSelectionProps = {
    draggedItem: null,
    mouseY: new Animated.Value(0)
};

class TodoSelection extends React.Component {
    /** @param {TodoSelectionPropsType} nextProps */
    shouldComponentUpdate(nextProps) {
        const { draggedItem } = this.props;
        return draggedItem !== nextProps.draggedItem;
    }

    render() {
        const { draggedItem, mouseY } = this.props;
        if (draggedItem === null) return null;

        const translate = {
            transform: [{ translateY: mouseY }]
        };

        return (
            <Animated.View style={[styles.selection, translate]}>
                <TodoButton style={styles.selectionTodo} todo={draggedItem} />
            </Animated.View>
        );
    }
}

TodoSelection.prototype.props = TodoSelectionProps;
TodoSelection.defaultProps = TodoSelectionProps;

export default TodoSelection;
