import * as React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import TodoButtonBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button } from 'Interface/Components';
import { WithInterpolation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Todoes').Todo} Todo
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 *
 * @typedef {Object} TodoPropsType
 * @property {StyleProp} style
 * @property {Todo | null} todo
 * @property {() => void} onDrag Icon to drag => onTouchStart event (todo only)
 * @property {(todo: Todo) => void} onCheck
 * @property {(todo: Todo, callbackRemove: (resolve: (cancel: () => void) => void) => void) => void} onRemove
 */

class TodoButton extends TodoButtonBack {
    render() {
        const { animElementY, animDeleteButtonX } = this.state;
        const { style, todo, onDrag } = this.props;
        if (todo === null) return null;

        const { title, checked } = todo;

        const styleAnimation = {
            transform: [{ translateY: WithInterpolation(animElementY, 0, -46) }]
        };

        const styleDeleteButton = {
            transform: [{ translateX: WithInterpolation(animDeleteButtonX, 64, 0) }]
        };

        return (
            <LinearGradient
                style={[styles.item, style]}
                colors={[
                    themeManager.GetColor('backgroundCard', { opacity: 0.45 }),
                    themeManager.GetColor('backgroundCard', { opacity: 0.2 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Button style={styles.parent} appearance='uniform' color='transparent' onPress={this.openTodo}>
                    <Animated.View style={[styles.content, styleAnimation, style]}>
                        {/* Check button */}
                        <Button
                            style={styles.checkbox}
                            color={checked !== 0 ? 'white' : 'transparent'}
                            onPress={this.onCheck}
                        >
                            {checked !== 0 && <Icon icon='check' color='main1' size={16} />}
                        </Button>

                        {/* Content */}
                        <TouchableOpacity style={styles.title} onPress={this.openTodo} activeOpacity={0.6}>
                            {/* Title & deadline */}
                            <Text style={styles.titleText}>{title}</Text>
                            {!!this.deadlineText.length && (
                                <Text style={styles.dateText} color={this.colorText}>
                                    {this.deadlineText}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Drag&Drop button */}
                        <View onTouchStart={() => onDrag()}>
                            <Icon icon='moveVertical' color='main1' />
                        </View>

                        {/* Check button */}
                        <Button
                            style={styles.trashButton}
                            styleAnimation={styleDeleteButton}
                            color={'backgroundCard'}
                            onPress={this.onRemove}
                        >
                            <Icon icon='trash' color='danger' size={16} />
                        </Button>
                    </Animated.View>
                </Button>
            </LinearGradient>
        );
    }
}

export { TodoButton };
