import React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import InventoryPanel from './InventoryPanel';
import { GetStringLength } from 'Utils/String';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ScrollView} ScrollView
 * @typedef {import('react-native').NativeScrollEvent} NativeScrollEvent
 * @typedef {import('react-native').NativeSyntheticEvent<NativeScrollEvent>} NativeSyntheticScrollEvent
 */

class BackProfile extends PageBase {
    state = {
        scrollY: new Animated.Value(0),

        // Avatar edit mode
        editMode: new Animated.Value(0), // 0 = normal, 1 = edit mode
        avatarTranslateX: new Animated.Value(-1 / 4), // Ratio of screenWidth
        avatarTranslateY: new Animated.Value(0),
        avatarScale: new Animated.Value(1), // Scale of avatar

        ...this.getUpdatedExperience()
    };

    /** @type {React.RefObject<ScrollView | null>} */
    refScrollView = React.createRef();

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
        user.interface.BackHandle();
    };

    openInventory = () => {
        this.enterEditMode();

        // Open bottom panel with category change callback
        user.interface.bottomPanel?.Open({
            content: <InventoryPanel onSlotChange={this.adjustAvatarPositionForCategory} />,
            overlayColor: '#00000001',
            onClose: () => {
                this.exitEditMode();
            }
        });
    };

    closeInventory = () => {
        user.interface.bottomPanel?.Close();
    };

    /**
     * Enter edit mode for avatar customization
     * Hides UI and centers avatar with smooth animations
     */
    enterEditMode = () => {
        // Scroll page to top
        this.refScrollView.current?.scrollTo({ y: 0, animated: true });

        // Move avatar to center
        this.adjustAvatarPosition({ editMode: 1, x: -1 / 2, y: -100 });
    };

    /**
     * Exit edit mode and restore normal view
     */
    exitEditMode = () => {
        this.adjustAvatarPosition({ editMode: 0, x: -1 / 4, y: 0, scale: 1 });
    };

    /**
     * Adjust avatar vertical position based on selected category
     * @param {'all' | 'hair' | 'top' | 'bottom' | 'shoes' | null} category
     */
    adjustAvatarPositionForCategory = (category) => {
        switch (category) {
            case 'hair':
                this.adjustAvatarPosition({ y: 100, scale: 1.5 });
                break;
            case 'top':
                this.adjustAvatarPosition({ y: -50, scale: 1.25 });
                break;
            case 'bottom':
                this.adjustAvatarPosition({ y: -350, scale: 0.8 });
                break;
            case 'shoes':
                this.adjustAvatarPosition({ y: -600, scale: 1.3 });
                break;
            case 'all':
            default:
                this.adjustAvatarPosition({ y: -100, scale: 1 });
                break;
        }
    };

    /**
     * @param {object} newPos
     * @param {number} [newPos.x] Position in ratio of screen width (-0.25 = center)
     * @param {number} [newPos.y]
     * @param {number} [newPos.scale]
     * @param {number} [newPos.editMode]
     */
    adjustAvatarPosition = (newPos) => {
        const { avatarTranslateX, avatarTranslateY, avatarScale } = this.state;

        const animations = [];
        if (newPos.x !== undefined) animations.push(SpringAnimation(avatarTranslateX, newPos.x));
        if (newPos.y !== undefined) animations.push(SpringAnimation(avatarTranslateY, newPos.y));
        if (newPos.scale !== undefined) animations.push(SpringAnimation(avatarScale, newPos.scale));
        if (newPos.editMode !== undefined) animations.push(SpringAnimation(this.state.editMode, newPos.editMode));

        Animated.parallel(animations).start();
    };
}

export default BackProfile;
