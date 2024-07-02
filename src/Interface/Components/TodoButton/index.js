import * as React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import TodoButtonBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button, CheckBox } from 'Interface/Components';
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
                style={[styles.parent, style]}
                colors={[
                    themeManager.GetColor('backgroundCard', { opacity: 0.45 }),
                    themeManager.GetColor('backgroundCard', { opacity: 0.2 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Button
                    style={styles.buttonLeft}
                    appearance='uniform'
                    color='transparent'
                    onPress={this.onCheck}
                    onTouchStart={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    <CheckBox value={checked !== 0} />
                </Button>

                <Button
                    style={styles.buttonRight}
                    styleContent={styles.buttonRightContent}
                    appearance='uniform'
                    color='transparent'
                    onPress={this.openTodo}
                >
                    <View style={styles.contentLeft}>
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    <Animated.View style={[styles.contentRight, styleAnimation]}>
                        {/* Deadline */}
                        <Text style={styles.dateText} color='main2'>
                            {'[27/06/24]'}
                        </Text>
                        <Icon style={styles.dateIcon} icon='clock-outline' color='main2' />

                        <Icon icon='arrow-square' color='gradient' angle={90} />

                        {/* {!!this.deadlineText.length && (
                            <Text style={styles.dateText} color={this.colorText}>
                                {this.deadlineText}
                            </Text>
                        )} */}

                        {/* Drag&Drop button */}
                        {/* <View onTouchStart={() => onDrag()}>
                            <Icon icon='add-outline' color='main1' />
                        </View> */}

                        {/* Check button */}
                        {/* <Button
                            style={styles.trashButton}
                            styleAnimation={styleDeleteButton}
                            color={'backgroundCard'}
                            onPress={this.onRemove}
                        >
                            <Icon icon='trash' color='danger' size={16} />
                        </Button> */}
                    </Animated.View>
                </Button>
            </LinearGradient>
        );
    }
}

export { TodoButton };
