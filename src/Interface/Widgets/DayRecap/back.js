import React from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Share from 'react-native-share';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { GetLocalTime } from 'Utils/Time';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').Activity} Activity
 *
 * @typedef {object} ActivityData
 * @property {string} name
 * @property {number} durationMinutes
 * @property {string} color
 *
 * @typedef {object} DayRecapData
 * @property {string} username
 * @property {number} level
 * @property {number} xpGained
 * @property {number} xpCurrent - Current XP in level
 * @property {number} xpNext - XP required for next level
 * @property {number} totalMinutes
 * @property {ActivityData[]} categories - For donut chart (grouped by category)
 * @property {ActivityData[]} skills - For activity list (individual skills)
 * @property {StatsXP} statsGained
 * @property {StatsXP} totalStats
 *
 * @typedef {object} DayRecapProps
 * @property {StyleProp} [style]
 * @property {Date} date - The date to display recap for
 * @property {() => void} [onClose]
 */

/** @type {DayRecapProps} */
const DayRecapProps = {
    style: /** @type {StyleProp} */ ({}),
    date: new Date(),
    onClose: () => {}
};

/**
 * @typedef {object} DayRecapState
 * @property {boolean} isCapturing
 * @property {boolean} isSaving
 * @property {boolean} isSharing
 * @property {DayRecapData | null} recapData
 */

class BackDayRecap extends React.Component {
    /** @type {React.RefObject<import('react-native-view-shot').default | null>} */
    viewShotRef = React.createRef();

    /** @type {DayRecapState} */
    state = {
        isCapturing: false,
        isSaving: false,
        isSharing: false,
        recapData: null
    };

    componentDidMount() {
        this.computeRecapData();
    }

    /**
     * @param {DayRecapProps} prevProps
     */
    componentDidUpdate(prevProps) {
        if (prevProps.date !== this.props.date) {
            this.computeRecapData();
        }
    }

    /**
     * Compute all the recap data for the selected date
     */
    computeRecapData = () => {
        const { date } = this.props;

        // Get activities for this day
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const startTime = GetLocalTime(dayStart);

        const allActivities = user.activities.allActivities.Get();
        const dayActivities = allActivities.filter((activity) => {
            const activityTime = activity.startTime + activity.timezone * 3600;
            return activityTime >= startTime && activityTime < startTime + 24 * 60 * 60;
        });

        // Group by CATEGORY for donut chart, and by SKILL for activity list
        /** @type {Map<number, { name: string, durationMinutes: number, color: string, xp: number }>} */
        const categoryMap = new Map();
        /** @type {Map<number, { name: string, durationMinutes: number, color: string, xp: number }>} */
        const skillMap = new Map();

        /** @type {StatsXP} */
        const statsGained = { int: 0, soc: 0, for: 0, sta: 0, agi: 0, dex: 0 };
        let totalXP = 0;
        let totalMinutes = 0;

        for (const activity of dayActivities) {
            const skill = dataManager.skills.GetByID(activity.skillID);
            if (!skill) continue;

            // Get category for grouping and color
            const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
            if (!category) continue;

            const color = category.Color || '#7c3aed';
            const categoryName = langManager.GetText(category.Name);

            const duration = activity.duration;
            totalMinutes += duration;

            // XP calculation
            const durationHour = duration / 60;
            const xp = skill.XP * durationHour;
            totalXP += xp;

            // Stats
            for (const stat of user.experience.statsKey) {
                statsGained[stat] += Math.round(skill.Stats[stat] * durationHour);
            }

            // Group by category (for donut chart)
            const existingCategory = categoryMap.get(category.ID);
            if (existingCategory) {
                existingCategory.durationMinutes += duration;
                existingCategory.xp += xp;
            } else {
                categoryMap.set(category.ID, {
                    name: categoryName,
                    durationMinutes: duration,
                    color: color,
                    xp
                });
            }

            // Group by skill (for activity list)
            const skillName = langManager.GetText(skill.Name);
            const existingSkill = skillMap.get(skill.ID);
            if (existingSkill) {
                existingSkill.durationMinutes += duration;
                existingSkill.xp += xp;
            } else {
                skillMap.set(skill.ID, {
                    name: skillName,
                    durationMinutes: duration,
                    color: color,
                    xp
                });
            }
        }

        // Sort categories by duration (for donut chart)
        const categories = Array.from(categoryMap.values())
            .sort((a, b) => b.durationMinutes - a.durationMinutes)
            .map(({ name, durationMinutes, color }) => ({ name, durationMinutes, color }));

        // Sort skills by duration (for activity list)
        const skills = Array.from(skillMap.values())
            .sort((a, b) => b.durationMinutes - a.durationMinutes)
            .map(({ name, durationMinutes, color }) => ({ name, durationMinutes, color }));

        // Get user info
        const experience = user.experience.experience.Get();
        const username = user.informations.username.Get() || 'Player';
        const level = experience.xpInfo.lvl;
        const xpCurrent = experience.xpInfo.xp;
        const xpNext = experience.xpInfo.next;
        const totalStats = experience.stats;

        /** @type {DayRecapData} */
        const recapData = {
            username,
            level,
            xpGained: Math.round(totalXP),
            xpCurrent,
            xpNext,
            totalMinutes,
            categories,
            skills,
            statsGained,
            totalStats
        };

        this.setState({ recapData });
    };

    /**
     * Capture the view as an image
     * @returns {Promise<string | null>} URI of the captured image
     */
    captureImage = async () => {
        const viewShot = this.viewShotRef.current;
        if (!viewShot || typeof viewShot.capture !== 'function') {
            return null;
        }

        try {
            this.setState({ isCapturing: true });

            const uri = await viewShot.capture();
            return uri;
        } catch (error) {
            console.error('[DayRecap] Capture error:', error);
            return null;
        } finally {
            this.setState({ isCapturing: false });
        }
    };

    /**
     * Request permission to save to gallery (Android only)
     * @returns {Promise<boolean>}
     */
    requestSavePermission = async () => {
        if (Platform.OS !== 'android') {
            return true;
        }

        // Android 13+ doesn't need WRITE_EXTERNAL_STORAGE for media
        if (Platform.Version >= 33) {
            return true;
        }

        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: 'Permission requise',
                message: "GameLife a besoin d'accéder à votre galerie pour sauvegarder l'image",
                buttonNeutral: 'Plus tard',
                buttonNegative: 'Annuler',
                buttonPositive: 'OK'
            });
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.error('[DayRecap] Permission error:', err);
            return false;
        }
    };

    /**
     * Save the recap image to the device gallery
     */
    saveToGallery = async () => {
        const langRecap = langManager.curr['calendar']?.['recap'] || {};

        const hasPermission = await this.requestSavePermission();
        if (!hasPermission) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langRecap['permission-denied-title'] || 'Permission denied',
                    message: langRecap['permission-denied-message'] || 'Cannot save without permission'
                }
            });
            return;
        }

        this.setState({ isSaving: true });

        try {
            const uri = await this.captureImage();
            if (!uri) {
                throw new Error('Failed to capture image');
            }

            await CameraRoll.save(uri, { type: 'photo', album: 'GameLife' });

            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langRecap['saved-title'] || 'Saved!',
                    message: langRecap['saved-message'] || 'Image has been saved to your gallery'
                }
            });
        } catch (error) {
            console.error('[DayRecap] Save error:', error);
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langRecap['error-title'] || 'Error',
                    message: langRecap['error-message'] || 'Failed to save image'
                }
            });
        } finally {
            this.setState({ isSaving: false });
        }
    };

    /**
     * Share the recap image to social media or other apps
     * @param {'instagram' | 'instagram-stories' | 'general'} [target='general']
     */
    shareImage = async (target = 'general') => {
        this.setState({ isSharing: true });

        try {
            const uri = await this.captureImage();
            if (!uri) {
                throw new Error('Failed to capture image');
            }

            /** @type {import('react-native-share').ShareOptions} */
            const shareOptions = {
                url: uri,
                type: 'image/png',
                failOnCancel: false
            };

            if (target === 'instagram-stories') {
                // Share to Instagram Stories
                await Share.shareSingle({
                    ...shareOptions,
                    social: /** @type {any} */ (Share.Social.INSTAGRAM_STORIES),
                    backgroundBottomColor: '#1a1a2e',
                    backgroundTopColor: '#16213e'
                });
            } else if (target === 'instagram') {
                // Share to Instagram Feed
                await Share.shareSingle({
                    ...shareOptions,
                    social: /** @type {any} */ (Share.Social.INSTAGRAM)
                });
            } else {
                // General share sheet
                await Share.open(shareOptions);
            }
        } catch (error) {
            // User cancelled - not an error
            const err = /** @type {Error | null} */ (error);
            if (err?.message?.includes('cancel')) {
                return;
            }
            console.error('[DayRecap] Share error:', error);
        } finally {
            this.setState({ isSharing: false });
        }
    };

    /**
     * Compute radar chart data from stats
     * @param {StatsXP} stats
     * @returns {Array<{label: string, value: number}>}
     */
    computeRadarData = (stats) => {
        const values = Object.values(stats);
        const maxValue = Math.max(...values, 1);

        return user.experience.statsKey.map((key) => ({
            label: key.toUpperCase().slice(0, 3),
            value: maxValue > 0 ? stats[key] / maxValue : 0
        }));
    };

    /**
     * Format minutes to hours and minutes string
     * @param {number} minutes
     * @returns {string}
     */
    formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours === 0) {
            return `${mins}m`;
        }
        if (mins === 0) {
            return `${hours}h`;
        }
        return `${hours}h${mins.toString().padStart(2, '0')}`;
    };
}

BackDayRecap.prototype.props = DayRecapProps;
BackDayRecap.defaultProps = DayRecapProps;

export default BackDayRecap;
