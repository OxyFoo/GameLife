import React from 'react';
import { Animated } from 'react-native';

import styles from './style';
import QuestElement from './quest';

/** 
 * @typedef {import('Class/Quests').Quest} Quest
 */

const QuestSelectionProps = {
    /** @type {Quest|null} */
    draggedItem: null,

    mouseY: new Animated.Value(0)
}

class QuestSelection extends React.Component {
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
                <QuestElement
                    style={styles.selectionQuest}
                    quest={draggedItem}
                />
            </Animated.View>
        );
    }
}

QuestSelection.prototype.props = QuestSelectionProps;
QuestSelection.defaultProps = QuestSelectionProps;

export default QuestSelection;