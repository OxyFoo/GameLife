import React from 'react';
import { Animated, Keyboard } from 'react-native';

//import StartMission from './mission';
import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { DeepCopy } from 'Utils/Object';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ScrollView} ScrollView
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').NativeScrollEvent} NativeScrollEvent
 * @typedef {import('react-native').NativeSyntheticEvent<NativeScrollEvent>} NativeSyntheticEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Types/Data/User/Quests').Quest} Quest
 * @typedef {import('Data/User/Quests').InputsError} InputsError
 *
 * @typedef {'add' | 'save' | 'remove'} States
 */

const BackQuestProps = {
    args: {
        /** @type {Quest | null} */
        quest: null
    }
};

class BackQuest extends PageBase {
    state = {
        /** @type {States} */
        action: 'add',

        /** @type {Quest} */
        tempQuest: {
            title: '',
            comment: '',
            created: 0, // 0 To autodefined when added
            maximumStreak: 0,
            schedule: {
                type: 'frequency',
                frequencyMode: 'week',
                quantity: 1,
                duration: 60
            },
            skills: []
        },

        editButtonHeight: 0,
        animEditButton: new Animated.Value(0),

        /** @type {Array<InputsError>} Error message to display */
        errors: []
    };

    /** @type {Quest | null} */
    selectedQuest = null;

    /** @type {React.RefObject<ScrollView>} */
    refScrollView = React.createRef();

    /** @type {number} Position of the scroll (0-1) */
    scrollRatio = 0;

    /** @param {BackQuestProps} props */
    constructor(props) {
        super(props);

        if (props.args?.quest) {
            /** @type {Quest | null} */
            const quest = props.args.quest || null;
            this.selectedQuest = quest;

            if (quest === null) {
                user.interface.BackHandle();
                user.interface.console?.AddLog('error', 'Quest: Quest not found');
                return;
            }

            this.state = {
                ...this.state,
                action: 'remove',
                tempQuest: DeepCopy(quest)
            };
        }
    }

    componentDidMount() {
        //StartMission.call(this, this.props.args?.missionName);
        user.interface.AddCustomBackHandler(this.BackHandler);
        this.onChangeQuest(this.state.tempQuest);
    }

    /** @param {LayoutChangeEvent} event */
    onEditButtonLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ editButtonHeight: height });
    };

    /** @param {NativeSyntheticEvent} event */
    onScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        const { height } = event.nativeEvent.contentSize;
        const { height: layoutHeight } = event.nativeEvent.layoutMeasurement;
        this.scrollRatio = y / (height - layoutHeight);
    };

    /** @param {Quest} quest */
    IsEdited = (quest) => {
        if (this.selectedQuest === null) {
            return false;
        }

        const oldQuest = DeepCopy(this.selectedQuest);
        const newQuest = DeepCopy(quest);

        if (newQuest.schedule.type !== oldQuest.schedule.type) {
            return true;
        }

        newQuest.skills = newQuest.skills.sort();
        oldQuest.skills = oldQuest.skills.sort();
        if (newQuest.schedule.type !== 'frequency' && oldQuest.schedule.type !== 'frequency') {
            newQuest.schedule.repeat = newQuest.schedule.repeat.sort();
            oldQuest.schedule.repeat = oldQuest.schedule.repeat.sort();
        }

        return JSON.stringify(oldQuest) !== JSON.stringify(newQuest);
    };

    /** @param {Quest} quest */
    onChangeQuest = (quest) => {
        const { action, animEditButton } = this.state;

        const errors = user.quests.VerifyInputs(quest);

        if (action === 'save' || action === 'remove') {
            const edited = this.IsEdited(quest);
            this.setState(
                {
                    action: edited ? 'save' : 'remove',
                    tempQuest: quest,
                    errors
                },
                () => {
                    // If scroll is at the bottom, scroll to the bottom
                    if (this.scrollRatio >= 0.9) {
                        this.refScrollView.current?.scrollToEnd({ animated: true });
                    }
                }
            );
            SpringAnimation(animEditButton, edited ? 1 : 0).start();
            return;
        }

        this.setState({ tempQuest: quest, errors });
    };

    onBackPress = () => {
        user.interface.BackHandle();
    };

    /** @returns {boolean} */
    BackHandler = () => {
        const { action } = this.state;

        // Don't show popup or quest not edited => leave
        if (action === 'remove') {
            user.interface.RemoveCustomBackHandler(this.BackHandler);
            user.interface.ChangePage('queststats', {
                args: { quest: this.selectedQuest, showAnimations: false },
                storeInHistory: false,
                transition: 'fromLeft'
            });
            return false;
        }

        if (action === 'add') {
            user.interface.RemoveCustomBackHandler(this.BackHandler);
            user.interface.BackHandle();
            return false;
        }

        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: langManager.curr['quest']['alert-back-title'],
                message: langManager.curr['quest']['alert-back-message']
            },
            callback: (btn) => {
                if (btn === 'yes') {
                    user.interface.RemoveCustomBackHandler(this.BackHandler);
                    user.interface.ChangePage('queststats', {
                        args: { quest: this.selectedQuest, showAnimations: false },
                        storeInHistory: false,
                        transition: 'fromLeft'
                    });
                }
            }
        });
        return false;
    };

    /** @param {GestureResponderEvent} event */
    keyboardDismiss = (event) => {
        if (event.target === event.currentTarget) {
            Keyboard.dismiss();
        }
        return false;
    };

    AddQuest = () => {
        const { tempQuest } = this.state;
        const addStatus = user.quests.Add(tempQuest);

        if (addStatus === 'added') {
            // Update mission
            user.missions.SetMissionState('mission2', 'completed');

            user.GlobalSave();
            user.interface.RemoveCustomBackHandler(this.BackHandler);
            user.interface.ChangePage('queststats', {
                args: { quest: tempQuest, showAnimations: false },
                storeInHistory: false,
                transition: 'fromLeft'
            });
        } else if (addStatus === 'already-added') {
            user.interface.console?.AddLog('warn', 'Quest: Quest already added');
            user.interface.RemoveCustomBackHandler(this.BackHandler);
            user.interface.BackHandle();
        } else {
            user.interface.console?.AddLog('error', 'Quest: Unknown error');
        }
    };

    EditQuest = () => {
        const { tempQuest } = this.state;

        if (this.selectedQuest === null) {
            user.interface.console?.AddLog('error', 'Quest: Selected quest is null');
            return;
        }

        const addition = user.quests.Edit(this.selectedQuest, tempQuest);

        if (addition === 'edited') {
            // Update mission
            user.missions.SetMissionState('mission2', 'completed');

            user.GlobalSave();
            user.interface.RemoveCustomBackHandler(this.BackHandler);
            user.interface.ChangePage('queststats', {
                args: { quest: tempQuest, showAnimations: false },
                storeInHistory: false,
                transition: 'fromLeft'
            });
        } else if (addition === 'not-exists') {
            user.interface.console?.AddLog('warn', 'Quest: Quest not exist');
            user.interface.RemoveCustomBackHandler(this.BackHandler);
            user.interface.BackHandle();
        } else {
            user.interface.console?.AddLog('error', 'Quest: Unknown error');
        }
    };

    RemoveQuest = () => {
        if (this.selectedQuest === null) {
            user.interface.console?.AddLog('error', 'Quest: Selected quest is null');
            return;
        }

        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: langManager.curr['quest']['alert-remquest-title'],
                message: langManager.curr['quest']['alert-remquest-message']
            },
            callback: (btn) => {
                if (btn === 'yes' && this.selectedQuest !== null) {
                    const remove = user.quests.Remove(this.selectedQuest);
                    if (remove === 'removed') {
                        user.GlobalSave();
                        user.interface.RemoveCustomBackHandler(this.BackHandler);
                        user.interface.BackHandle();
                    } else if (remove === 'notExist') {
                        user.interface.console?.AddLog('warn', 'Quest: Quest not exist');
                    }
                }
            }
        });
    };
}

BackQuest.defaultProps = BackQuestProps;
BackQuest.prototype.props = BackQuestProps;

export default BackQuest;
