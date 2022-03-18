import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * @typedef {import('./Icon').Icons} Icons
 * @typedef {import('../../Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('../../Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const TaskProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    item: {}
}

class TaskElement extends React.Component {
    render() {
        const { style, item } = this.props;
        return (
            <View style={[styles.parent, style]}>
            </View>
        );
    }
}

TaskElement.prototype.props = TaskProps;
TaskElement.defaultProps = TaskProps;

const styles = StyleSheet.create({
    parent: {}
});

export default TaskElement;