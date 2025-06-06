import React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import { GetStringLength } from 'Utils/String';

/**
 * @typedef {import('react-native').NativeScrollEvent} NativeScrollEvent
 * @typedef {import('react-native').NativeSyntheticEvent<NativeScrollEvent>} NativeSyntheticScrollEvent
 *
 * @typedef {import('./EditAvatar').default} EditorAvatar
 * @typedef {import('./Components/statistic').StatsValues} StatsValues
 */

class BackProfile extends PageBase {
    state = {
        scrollY: new Animated.Value(0),
        editorOpened: false,
        infoHeaderHeight: 258, // Arbitrary value to reduce the glitch on the first render
        ...this.getUpdatedExperience()
    };

    /** @type {React.RefObject<EditorAvatar | null>} */
    refAvatar = React.createRef();

    /** @type {Symbol | null} */
    activitiesListener = null;

    static feKeepMounted = true;

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState({ ...this.getUpdatedExperience() });
        });
    }

    componentDidFocused = (/*args*/) => {
        // Update the avatar
        // TODO: Don't update the avatar if the user didn't change anything
        this.refAvatar.current?.updateEquippedItems();
        this.refAvatar.current?.forceUpdate();
        if (this.refAvatar.current?.state.slotSelected !== null) {
            this.refAvatar.current?.selectSlot(this.refAvatar.current?.state.slotSelected);
        }
        this.refAvatar.current?.refFrame.forceUpdate();
    };

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    getUpdatedExperience() {
        return {
            experienceUser: user.experience.experience.Get().xpInfo,
            experienceStats: user.experience.statsKey
                .sort(
                    (a, b) =>
                        GetStringLength(langManager.curr['statistics']['names'][b]) -
                        GetStringLength(langManager.curr['statistics']['names'][a])
                )
                .map((statKey) => ({
                    statKey,
                    experience: user.experience.experience.Get().stats[statKey]
                }))
        };
    }

    /** @param {any} event */
    onLayoutHeader = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ infoHeaderHeight: height });
    };

    /** @param {NativeSyntheticScrollEvent} event */
    handleScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        this.state.scrollY.setValue(y);
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

    openFriends = () => {
        user.interface.ChangePage('friends');
    };

    onBack = () => {
        if (this.refAvatar.current !== null && this.refAvatar.current.state.editorOpened) {
            this.refAvatar.current.CloseEditor();
        } else {
            user.interface.BackHandle();
        }
    };
}

export default BackProfile;
