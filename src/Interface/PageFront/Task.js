import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import BackTask from '../PageBack/Task';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { PageHeader, TaskSchedule } from '../Widgets';
import { Button, Icon, Input, Page, TaskElement, Text } from '../Components';

class Task extends BackTask {
    renderCommentary = () => {
        const lang = langManager.curr['task'];
        const backgroundCard = { backgroundColor: themeManager.GetColor('backgroundCard') };

        if (this.state.description === null) {
            return (
                <Button
                    style={styles.comButton}
                    onPress={this.onAddComment}
                    color='main1'
                    fontSize={14}
                >
                    {lang['button-commentary']}
                </Button>
            );
        }
        return (
            <View>
                {/* Comment title */}
                <Text style={styles.sectionTitle} fontSize={22}>{lang['title-commentary']}</Text>

                {/* Comment content */}
                <TouchableOpacity
                    style={[styles.commentPanel, backgroundCard]}
                    activeOpacity={.6}
                    onPress={this.onEditComment}
                    onLongPress={this.onRemComment}
                >
                    <Text style={styles.description}>{this.state.description}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const lang = langManager.curr['task'];
        const { action, deadline, repeatMode, repeatDays, error } = this.state;

        let btnText = lang['button-add'];
        let btnColor = 'main2';
        if (action === 'edit') {
            btnText = lang['button-save'];
            btnColor = 'success';
        }
        if (action === 'remove') {
            btnText = lang['button-remove'];
            btnColor = 'danger';
        }

        const initValues = action === 'new' ? null : [deadline, repeatMode, repeatDays];

        return (
            <Page bottomOffset={0}>
                <PageHeader
                    onBackPress={() => user.interface.BackPage()}
                />

                <Input
                    style={styles.top}
                    label={lang['input-title']}
                    text={this.state.title}
                    maxLength={128}
                    onChangeText={this.onChangeTitle}
                />
                <Text fontSize={16} color='error'>{error}</Text>

                <TaskSchedule
                    initValues={initValues}
                    onChange={this.onChangeSchedule}
                />

                <View style={[styles.row, styles.sectionTitle]}>
                    <Text fontSize={22}>{lang['title-subtasks']}</Text>
                    <Icon icon='add' />
                </View>
                <Text>[[Components: subtasks]]</Text>

                {this.renderCommentary()}

                <Button
                    style={styles.button}
                    color={btnColor}
                    onPress={this.onButtonPress}
                    enabled={error.length === 0}
                >
                    {btnText}
                </Button>
            </Page>
        )
    }
}

const styles = StyleSheet.create({
    top: {
        marginTop: 32,
        marginBottom: 6
    },
    sectionTitle: {
        marginTop: 32,
        marginBottom: 12
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    comButton: {
        height: 48,
        marginTop: 48,
        marginHorizontal: 20
    },
    commentPanel: {
        padding: '5%',
        borderRadius: 24
    },
    description: {
        fontSize: 16,
        textAlign: 'left'
    },
    button: {
        marginTop: 48
    }
});

export default Task;