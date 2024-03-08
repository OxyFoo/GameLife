import * as React from 'react';
import { StyleSheet } from 'react-native';

import user from 'Managers/UserManager';

import BackTodo from './back';
import SectionTitle from './Sections/title';
import SectionDescription from './Sections/description';
import SectionSchedule from './Sections/schedule';
import SectionTasks from './Sections/tasks';

import StartHelp from './help';
import { PageHeader } from 'Interface/Widgets';
import { Button, Page } from 'Interface/Components';
import KeyboardSpacerView from 'Interface/Components/KeyboardSpacerView';

class Todo extends BackTodo {
    render() {
        const { title, error } = this.state;

        return (
            <Page
                ref={ref => this.refPage = ref}
                onStartShouldSetResponder={this.keyboardDismiss}
                overlay={this.renderOverlay()}
                bottomOffset={72}
            >
                <PageHeader
                    onBackPress={user.interface.BackHandle}
                    onHelpPress={StartHelp.bind(this)}
                />

                <SectionTitle
                    title={title}
                    error={error}
                    onChangeTitle={this.onChangeTitle}
                />

                <SectionSchedule
                    ref={ref => this.refSectionSchedule = ref}
                    onChange={this.onEditTodo}
                />

                <SectionDescription
                    ref={ref => this.refSectionDescription = ref}
                    onChange={this.onEditTodo}
                />

                <SectionTasks
                    ref={ref => this.refSectionTasks = ref}
                    onChange={this.onEditTodo}
                />

                <KeyboardSpacerView />
            </Page>
        );
    }

    renderOverlay = () => {
        const { button, error } = this.state;

        return (
            <Button
                style={styles.button}
                color={button.color}
                onPress={this.onButtonPress}
                enabled={error.length === 0}
            >
                {button.text}
            </Button>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        height: 50,
        left: 0,
        right: 0,
        bottom: 0,
        marginBottom: 24,
        marginHorizontal: 24
    }
});

export default Todo;
