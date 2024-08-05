import * as React from 'react';
import { ScrollView } from 'react-native';

import langManager from 'Managers/LangManager';

import styles from './style';
import BackQuest from './back';
import SectionTitle from './Sections/title';
import SectionSkill from './Sections/skills';
import SectionDuration from './Sections/duration';
import SectionSchedule from './Sections/Schedule';
import SectionComment from './Sections/comment';

import { Text, Button } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';
import { WithInterpolation } from 'Utils/Animations';

/**
 * @typedef {import('Managers/LangManager').Lang} Lang
 * @typedef {import('Class/Quests/MyQuests').InputsError} InputsError
 */

class Quest extends BackQuest {
    render() {
        const lang = langManager.curr['quest'];
        const { ShowTitle, ShowError } = this;
        const { action, tempQuest, animEditButton, editButtonHeight, errors } = this.state;

        const title = this.selectedQuest === null ? lang['title-new'] : lang['title'];

        const styleMarginBottom = {
            marginBottom: editButtonHeight + 6
        };

        const styleAnimPage = {
            marginBottom: action === 'save' ? 24 + 8 : 0
        };
        const styleAnimEditButton = {
            opacity: animEditButton,
            transform: [
                {
                    translateY: WithInterpolation(animEditButton, editButtonHeight, 0)
                }
            ]
        };

        return (
            <>
                <ScrollView style={[styles.page, styleAnimPage]} onStartShouldSetResponder={this.keyboardDismiss}>
                    <PageHeader style={styles.pageHeader} title={title} onBackPress={this.onBackPress} />

                    <ShowTitle title='title' />
                    <SectionTitle quest={tempQuest} onChangeQuest={this.onChangeQuest} />
                    <ShowError error='title-empty' />
                    <ShowError error='title-exists' />

                    <ShowTitle title='schedule' />
                    <SectionSchedule quest={tempQuest} onChangeQuest={this.onChangeQuest} />
                    <ShowError error='schedule-empty' />

                    <ShowTitle title='skills' />
                    <SectionSkill quest={tempQuest} onChangeQuest={this.onChangeQuest} />
                    <ShowError error='skills-empty' />

                    <ShowTitle title='duration' />
                    <SectionDuration quest={tempQuest} onChangeQuest={this.onChangeQuest} />

                    <ShowTitle title='comment' />
                    <SectionComment quest={tempQuest} onChangeQuest={this.onChangeQuest} />

                    {/* Add button */}
                    {action === 'add' && (
                        <Button style={styles.addButton} onPress={this.AddQuest} enabled={errors.length === 0}>
                            {lang['button-text']['add']}
                        </Button>
                    )}

                    {/* Remove button */}
                    {action !== 'add' && (
                        <Button
                            style={[styles.removeButton, styleMarginBottom]}
                            appearance='outline'
                            onPress={this.RemoveQuest}
                        >
                            {lang['button-text']['remove']}
                        </Button>
                    )}
                </ScrollView>

                {/* Edit button */}
                {action !== 'add' && (
                    <Button
                        style={styles.overlayButton}
                        styleAnimation={styleAnimEditButton}
                        onPress={this.EditQuest}
                        onLayout={this.onEditButtonLayout}
                        enabled={errors.length === 0}
                        pointerEvents={action === 'save' ? 'auto' : 'none'}
                    >
                        {lang['button-text']['save']}
                    </Button>
                )}
            </>
        );
    }

    /** @param {{ title: keyof Lang['quest']['titles'] }} props */
    ShowTitle = ({ title: text }) => (
        <Text style={styles.sectionTitle} fontSize={22}>
            {langManager.curr['quest']['titles'][text]}
        </Text>
    );

    /** @param {{ error: InputsError }} props */
    ShowError = ({ error }) =>
        this.state.errors.includes(error) && (
            <Text style={styles.sectionError} color='error'>
                {langManager.curr['quest']['input-errors'][error]}
            </Text>
        );
}

export default Quest;
