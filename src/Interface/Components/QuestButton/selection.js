import React from 'react';
import { Animated } from 'react-native';

import styles from './style';
import { QuestButton } from './index';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 *
 * @typedef {Object} QuestSelectionProps
 * @prop {MyQuest | null} draggedItem
 * @prop {Animated.Value} mouseY
 */

/** @type {QuestSelectionProps} */
const QuestSelectionProps = {
    draggedItem: null,
    mouseY: new Animated.Value(0)
};

class QuestSelection extends React.Component {
    /** @param {QuestSelectionProps} nextProps */
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
                <QuestButton style={styles.selectionQuest} quest={draggedItem} />
            </Animated.View>
        );
    }
}

QuestSelection.prototype.props = QuestSelectionProps;
QuestSelection.defaultProps = QuestSelectionProps;

export default QuestSelection;
