import * as React from 'react';
import { StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import StartHelp from './help';
import BackQuest from './back';
import SectionTitle from './Sections/title';
import SectionSkill from './Sections/skills';
import SectionDuration from './Sections/duration';
import SectionSchedule from './Sections/schedule';
import SectionComment from './Sections/comment';

import { Page } from 'Interface/Global';
import { Text, Button } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

/**
 * @typedef {import('Managers/LangManager').Lang} Lang
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Class/Quests/MyQuests').InputsError} InputsError
 */

class Quest extends BackQuest {
    /** @param {{ title: keyof Lang['quest']['titles'] }} props */
    ShowTitle = ({ title: text }) => (
        <Text style={styles.sectionTitle} fontSize={22}>
            {langManager.curr['quest']['titles'][text]}
        </Text>
    )

    /** @param {{ error: InputsError }} props */
    ShowError = ({ error }) => this.state.errors.includes(error) && (
        <Text fontSize={16} color='error'>
            {langManager.curr['quest']['input-errors'][error]}
        </Text>
    )

    renderOverlayButton = () => {
        const {action, errors } = this.state;
        const lang = langManager.curr['quest'];

        /** @type {ThemeColor} */
        let color = 'main2';
        if (action === 'save') color = 'success';
        if (action === 'remove') color = 'danger';

        const buttonText = lang['button-text'][action];

        return (
            <Button
                style={styles.overlayButton}
                color={color}
                onPress={this.onButtonPress}
                enabled={errors.length === 0}
            >
                {buttonText}
            </Button>
        );
    }

    render() {
        const { ShowTitle, ShowError } = this;
        const { title, skills, schedule, duration, comment } = this.state;

        return (
            <Page
                ref={ref => this.refPage = ref}
                overlay={this.renderOverlayButton()}
                bottomOffset={72}
                onStartShouldSetResponder={this.keyboardDismiss}
            >
                <PageHeader
                    style={styles.pageHeader}
                    onBackPress={user.interface.BackHandle}
                    onHelpPress={StartHelp.bind(this)}
                />

                <ShowTitle title='title' />
                <SectionTitle
                    title={title}
                    onChange={this.onChangeTitle}
                />
                <ShowError error='title-empty' />
                <ShowError error='title-exists' />

                <ShowTitle title='skills' />
                <SectionSkill
                    ref={ref => this.refSectionSkill = ref}
                    skillsIDs={skills}
                    onChange={this.onChangeSkills}
                />
                <ShowError error='skills-empty' />

                <ShowTitle title='schedule' />
                <SectionSchedule
                    ref={ref => this.refSectionSchedule = ref}
                    schedule={schedule}
                    onChange={this.onScheduleChange}
                />
                <ShowError error='schedule-empty' />

                <ShowTitle title='duration' />
                <SectionDuration
                    duration={duration}
                    onChange={this.onChangeDuration}
                />

                <ShowTitle title='comment' />
                <SectionComment
                    ref={ref => this.refSectionComment = ref}
                    comment={comment}
                    onChange={this.onChangeComment}
                />
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    pageHeader: {
        marginBottom: 24
    },

    sectionTitle: {
        textAlign: 'left',
        marginTop: 24,
        marginBottom: 12
    },

    overlayButton: {
        position: 'absolute',
        height: 50,
        left: 0,
        right: 0,
        bottom: 0,
        marginBottom: 24,
        marginHorizontal: 24
    }
});

export default Quest;
