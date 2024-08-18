import * as React from 'react';
import { Animated, View, FlatList, TouchableOpacity } from 'react-native';

import styles from './style';
import BackSectionTasks from './back';
import langManager from 'Managers/LangManager';

import { Text, Button, Icon } from 'Interface/Components';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Class/Todoes').Task} Task
 */

class SectionTasks extends BackSectionTasks {
    render() {
        const lang = langManager.curr['todo'];
        const { style } = this.props;
        const { tasks, draggedItem, mouseY } = this.state;

        return (
            <View style={style}>
                <View style={styles.header}>
                    <Text style={styles.title}>{lang['input-task-title']}</Text>
                    <Button style={styles.smallButton} appearance='uniform' color='transparent' onPress={this.addTask}>
                        <Icon icon='add' size={26} color='gradient' />
                    </Button>
                </View>

                <View>
                    {draggedItem !== null && (
                        <Animated.View
                            style={[styles.selection, { transform: [{ translateY: mouseY }] }]}
                            pointerEvents='none'
                        >
                            <this.renderTask item={draggedItem} />
                        </Animated.View>
                    )}

                    <FlatList
                        data={tasks}
                        extraData={draggedItem}
                        keyExtractor={(item, index) => `task-${item.title}-${index}`}
                        renderItem={({ item }) => <this.renderTask item={item} onLayout={this.onLayoutItem} />}
                        onLayout={this.onLayout}
                        onTouchStart={this.onTouchStart}
                        onTouchMove={this.onTouchMove}
                        onTouchEnd={this.onTouchEnd}
                        onTouchCancel={this.onTouchEnd}
                        scrollEnabled={false}
                    />
                </View>
            </View>
        );
    }

    /**
     * @param {Object} props
     * @param {Task} props.item
     * @param {(event: LayoutChangeEvent) => void} [props.onLayout]
     */
    renderTask = ({ item, onLayout }) => {
        const { draggedItem } = this.state;

        const styleOpacity = { opacity: 1 };
        if (draggedItem === item) {
            styleOpacity.opacity = 0.25;
        }

        return (
            <View
                style={[styles.task, styleOpacity]}
                onLayout={onLayout}
                onTouchStart={(e) => this.dragStart(e, item)}
                onTouchMove={this.dragMove}
                onTouchEnd={this.dragEnd}
                onTouchCancel={this.dragEnd}
            >
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

export default SectionTasks;
