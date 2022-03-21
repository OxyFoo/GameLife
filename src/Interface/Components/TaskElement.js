import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

import user from '../../Managers/UserManager';

import Text from './Text';
import Icon from './Icon';
import Button from './Button';
import { DateToFormatString } from '../../Utils/Date';

/**
 * @typedef {import('../../Class/Tasks').Task} Task
 * @typedef {import('./Icon').Icons} Icons
 * @typedef {import('../../Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('../../Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const TaskProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    /** @type {Task} */
    item: {}
}

class TaskElement extends React.Component {
    state = {
        checked: false
    };

    onCheckboxPress = () => {
        const { checked } = this.state;
        this.setState({ checked: !checked });
    }

    openTask = () => {
        const { item } = this.props;
        user.interface.ChangePage('task', { task: item });
    }

    render() {
        const { checked } = this.state;
        const { style, item } = this.props;
        const { Title, Description, Deadline, Schedule } = item;

        let text = '';
        if (Deadline !== null) text = DateToFormatString(Deadline*1000);

        return (
            <TouchableOpacity
                style={[styles.parent, style]}
                onPress={this.openTask}
                activeOpacity={.6}
            >
                <View style={styles.title}>
                    <Button
                        style={styles.checkbox}
                        color={checked ? '#fff' : 'transparent'}
                        onPress={this.onCheckboxPress}
                    >
                        {checked && <Icon icon='chevron' color='main1' size={16} angle={80} />}
                    </Button>
                    <Text>{Title}</Text>
                </View>
                <Text>{text}</Text>
            </TouchableOpacity>
        );
    }
}

TaskElement.prototype.props = TaskProps;
TaskElement.defaultProps = TaskProps;

const styles = StyleSheet.create({
    parent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 14
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkbox: {
        width: 32,
        aspectRatio: 1,
        marginRight: 16,
        paddingHorizontal: 0,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8
    }
});

export default TaskElement;