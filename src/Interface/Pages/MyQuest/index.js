import * as React from 'react';
import { StyleSheet } from 'react-native';

import user from 'Managers/UserManager';

import StartHelp from './help';
import BackQuest from './back';
import SectionTitle from './Sections/title';
import SectionDescription from './Sections/description';
import SectionSkill from './Sections/activity';
import SectionDeadline from './Sections/deadline';
import SectionSchedule from './Sections/schedule';

import { PageHeader } from 'Interface/Widgets';
import { Button, Page } from 'Interface/Components';

class Quest extends BackQuest {
    render() {
        const { button, title, error } = this.state;

        return (
            <Page ref={ref => this.refPage = ref} onStartShouldSetResponder={this.keyboardDismiss}>
                <PageHeader
                    onBackPress={() => user.interface.BackHandle()}
                    onHelpPress={StartHelp.bind(this)}
                />

                <SectionTitle
                    title={title}
                    error={error}
                    onChangeTitle={this.onChangeTitle}
                />

                <SectionDeadline
                    ref={ref => this.refSectionDeadline = ref}
                    onChange={this.onEditQuest}
                />

                <SectionSchedule
                    ref={ref => this.refSectionSchedule = ref}
                    onChange={this.onEditQuest}
                />

                <SectionSkill
                    ref={ref => this.refSectionSkill = ref}
                    onChange={this.onEditQuest}
                />

                <SectionDescription
                    ref={ref => this.refSectionDescription = ref}
                    onChange={this.onEditQuest}
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

export default Quest;
