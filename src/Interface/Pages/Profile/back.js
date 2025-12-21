import React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import { GetStringLength } from 'Utils/String';
import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ScrollView} ScrollView
 * @typedef {import('react-native').NativeScrollEvent} NativeScrollEvent
 * @typedef {import('react-native').NativeSyntheticEvent<NativeScrollEvent>} NativeSyntheticScrollEvent
 * @typedef {import('./AvatarEditor').AvatarEditorRef} AvatarEditorRef
 */

class BackProfile extends PageBase {
    state = {
        editMode: false,
        ...this.getUpdatedExperience()
    };

    // Avatar edit mode
    avatarEditMode = new Animated.Value(0); // 0 = normal, 1 = edit mode

    /** @type {React.RefObject<ScrollView | null>} */
    refScrollView = React.createRef();

    scrollY = new Animated.Value(0);

    /** @type {React.RefObject<AvatarEditorRef | null>} */
    refAvatarEditor = React.createRef();

    /** @type {Symbol | null} */
    activitiesListener = null;

    static feKeepMounted = true;

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState({ ...this.getUpdatedExperience() });
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    getUpdatedExperience() {
        const exp = user.experience.experience.Get();
        return {
            experienceUser: exp.xpInfo,
            experienceStats: user.experience.statsKey
                .sort(
                    (a, b) =>
                        GetStringLength(langManager.curr['statistics']['names'][b]) -
                        GetStringLength(langManager.curr['statistics']['names'][a])
                )
                .map((statKey) => ({
                    statKey,
                    points: exp.stats[statKey]
                }))
        };
    }

    /** @param {NativeSyntheticScrollEvent} event */
    handleScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        this.scrollY.setValue(y);
    };

    openSettings = () => {
        user.interface.ChangePage('settings');
    };

    openSkills = () => {
        user.interface.ChangePage('skills');
    };

    openStatistics = () => {
        user.interface.ChangePage('statistics');
    };

    openAchievements = () => {
        user.interface.ChangePage('achievements');
    };

    onBack = () => {
        user.interface.BackHandle();
    };

    openInventory = () => {
        // Scroll page to top
        this.refScrollView.current?.scrollTo({ y: 0, animated: true });

        // Open avatar editor
        this.refAvatarEditor.current?.enterEditMode();

        // Hide interface
        TimingAnimation(this.avatarEditMode, 1, 300).start();

        // Set edit mode state
        this.setState({ editMode: true });
    };

    closeInventory = () => {
        // Show interface
        TimingAnimation(this.avatarEditMode, 0, 300).start();

        // Unset edit mode state
        this.setState({ editMode: false });

        // Refresh avatar in UserHeader
        user.interface.userHeader?.RefreshAvatar();
    };
}

export default BackProfile;
