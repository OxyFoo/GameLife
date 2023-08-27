import * as React from 'react';
import { StyleSheet } from 'react-native';

import BackTask from './back';
import SectionTitle from './Sections/title';
import SectionDescription from './Sections/description';
import SectionActivity from './Sections/activity';
import SectionSchedule from './Sections/schedule';
import SectionSubtasks from './Sections/subtasks';

import user from 'Managers/UserManager';

import { PageHeader } from 'Interface/Widgets';
import { Button, Page } from 'Interface/Components';

class Task extends BackTask {
    render() {
        const { button, title, error } = this.state;

        return (
            <Page ref={ref => this.refPage = ref} onStartShouldSetResponder={this.keyboardDismiss}>
                <PageHeader
                    onBackPress={() => user.interface.BackPage()}
                />

                <SectionTitle
                    title={title}
                    error={error}
                    onChangeTitle={this.onChangeTitle}
                />

                <SectionSchedule
                    ref={ref => this.refSectionSchedule = ref}
                    onChange={this.onChangeSchedule}
                />

                <SectionActivity
                    ref={ref => this.refSectionActivity = ref}
                />

                <SectionSubtasks
                    ref={ref => this.refSectionSubtasks = ref}
                    onChange={this.onEditTask}
                />

                <SectionDescription
                    ref={ref => this.refSectionDescription = ref}
                    onChange={this.onEditTask}
                />

                <Button
                    style={styles.button}
                    color={button.color}
                    onPress={this.onButtonPress}
                    enabled={error.length === 0}
                >
                    {button.text}
                </Button>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        marginTop: 48
    }
});

export default Task;