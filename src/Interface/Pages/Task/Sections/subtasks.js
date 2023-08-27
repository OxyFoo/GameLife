import * as React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Tasks } from 'Interface/Widgets';
import { Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('Class/Tasks').Subtask} Subtask
 */

const SectionSubtasksProps = {
    onChange: () => {}
};

class SectionSubtasks extends React.Component {
    state = {
        /** @type {Array<Subtask>} */
        subtasks: []
    }

    /** @param {Array<Subtask>} subtasks */
    SetSubtasks = (subtasks) => {
        this.setState({ subtasks });
    }
    GetSubtasks = () => {
        return this.state.subtasks;
    }

    addSubtask = () => {
        let { subtasks } = this.state;

        if (subtasks.length >= 20) {
            const title = langManager.curr['task']['alert-subtaskslimit-title'];
            const text = langManager.curr['task']['alert-subtaskslimit-text'];
            user.interface.popup.Open('ok', [title, text]);
            return;
        }

        subtasks.push({
            Checked: false,
            Title: ''
        });

        this.setState({ subtasks });
        this.props.onChange();
    }
    onEditSubtask = (index, checked, title) => {
        let { subtasks } = this.state;

        subtasks.splice(index, 1, {
            Checked: checked,
            Title: title
        });

        this.setState({ subtasks });
        this.props.onChange();
    }
    onDeleteSubtask = (index) => {
        let { subtasks } = this.state;

        subtasks.splice(index, 1);

        this.setState({ subtasks });
        this.props.onChange();
    }

    renderSubtasks = () => {
        if (!this.state.subtasks.length) return null;

        const background = { backgroundColor: themeManager.GetColor('main1') };

        return (
            <View style={[styles.subtasksContainer, background]}>
                <FlatList
                    style={{ height: 'auto' }}
                    data={this.state.subtasks}
                    keyExtractor={(item, index) => 'task-' + index.toString()}
                    renderItem={({ item, index }) => (
                        <Tasks.SubtaskElement
                            subtask={item}
                            onSubtaskEdit={(checked, title) => this.onEditSubtask(index, checked, title)}
                            onSubtaskDelete={() => this.onDeleteSubtask(index)}
                        />
                    )}
                />
            </View>
        );
    }

    render() {
        const lang = langManager.curr['task'];

        return (
            <>
                <View style={[styles.row, styles.sectionTitle]}>
                    <Text fontSize={22}>{lang['title-subtasks']}</Text>
                    <Icon icon='add' onPress={this.addSubtask} />
                </View>

                <this.renderSubtasks />
            </>
        );
    }
}

SectionSubtasks.prototype.props = SectionSubtasksProps;
SectionSubtasks.defaultProps = SectionSubtasksProps;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    sectionTitle: {
        marginTop: 32,
        marginBottom: 12
    },
    subtasksContainer: {
        padding: 28,
        paddingTop: 14,
        borderRadius: 8
    }
});

export default SectionSubtasks;