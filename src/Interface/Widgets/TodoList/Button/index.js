import * as React from 'react';
import { View, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import TodoButtonBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button, CheckBox } from 'Interface/Components';
import { WithInterpolation } from 'Utils/Animations';

class TodoButton extends TodoButtonBack {
    render() {
        const { animElementY, animDeleteButtonX, deadline } = this.state;
        const { style, onLayout, todo } = this.props;
        if (todo === null) return null;

        const { title, checked } = todo;
        const dateColor = (deadline !== null && deadline.deltaDays >= 0) || todo.checked ? 'main2' : 'danger';

        const styleAnimation = {
            transform: [{ translateY: WithInterpolation(animElementY, 0, -46) }]
        };

        const styleIcon = {
            opacity: WithInterpolation(animDeleteButtonX, 1, 0),
            transform: [{ scale: WithInterpolation(animDeleteButtonX, 1, 0.8) }]
        };

        const styleDeleteButton = {
            opacity: animDeleteButtonX,
            transform: [{ translateX: WithInterpolation(animDeleteButtonX, 100, 0) }]
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
                onLayout={onLayout}
            >
                {/* Check button */}
                <Button style={styles.checkButton} appearance='uniform' color='transparent' onPress={this.onCheck}>
                    <CheckBox style={styles.checkbox} value={checked !== 0} />
                </Button>

                {/* Todo button (title + date + icon) */}
                <Button
                    style={styles.buttonRight}
                    styleContent={styles.buttonRightContent}
                    appearance='uniform'
                    color='transparent'
                    onPress={this.openTodo}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    onTouchCancel={this.onTouchEnd}
                >
                    <View style={styles.titleView}>
                        <Text style={styles.titleText} numberOfLines={2} ellipsizeMode='tail'>
                            {title}
                        </Text>
                    </View>

                    <Animated.View style={[styles.todoContent, styleAnimation]}>
                        {/* Deadline */}
                        {deadline !== null && (
                            <>
                                <Text style={styles.todoDateText} color={dateColor}>
                                    {deadline.text}
                                </Text>

                                <Icon style={styles.todoDateIcon} icon='clock-outline' color={dateColor} />
                            </>
                        )}

                        <Animated.View style={styleIcon}>
                            <Icon icon='arrow-square' color='gradient' angle={90} />
                        </Animated.View>
                    </Animated.View>
                </Button>

                {/* Trash button */}
                <Button
                    style={styles.trashButton}
                    styleAnimation={styleDeleteButton}
                    appearance='uniform'
                    color='transparent'
                    onPress={this.onRemove}
                >
                    <Icon icon='trash' color='danger' size={24} />
                </Button>
            </LinearGradient>
        );
    }
}

export { TodoButton };
