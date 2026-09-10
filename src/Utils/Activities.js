import React from 'react';
import { View } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

// import Notifications from 'Utils/Notifications';
import { AddActivity as AddActivityView, BonusOxAdButton, BonusOxMention, RaidPointsMention } from 'Interface/Widgets';
import DynamicVar from 'Utils/DynamicVar';
import { AdBonusOx } from '@oxyfoo/gamelife-types/Rules/OxEconomy';
import { MinMax } from 'Utils/Functions';
import { GetDate, GetLocalTime, GetTimeZone, RoundTimeTo } from 'Utils/Time';

/**
 * @typedef {import('Data/User/Activities/index').Activity} Activity
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 */

const TIME_STEP_MINUTES = 5;
const MIN_TIME_MINUTES = 1 * TIME_STEP_MINUTES; // 5m
const MAX_TIME_MINUTES = 72 * TIME_STEP_MINUTES; // 6h

/** @param {number} skillID */
function StartActivityNow(skillID) {
    const startTime = GetLocalTime();
    const roundedTime = RoundTimeTo(TIME_STEP_MINUTES, startTime, 'prev');

    if (!user.activities.TimeIsFree(roundedTime, MIN_TIME_MINUTES * 2)) {
        const title = langManager.curr['activity']['alert-wrongtiming-title'];
        const message = langManager.curr['activity']['alert-wrongtiming-message'];
        user.interface.popup?.OpenT({
            type: 'ok',
            data: { title, message }
        });
        return;
    }

    user.activities.currentActivity.Set({
        skillID,
        startTime,
        timezone: GetTimeZone(),
        friendsIDs: []
    });

    user.SaveLocal();
    user.interface.ChangePage('activitytimer', { storeInHistory: false });
}

/**
 * @param {number} skillID
 * @param {number} startTime
 * @param {number} endTime
 * @param {number[]} friendsIDs
 * @returns {Promise<boolean>} True if activity was added successfully
 */
function AddActivityNow(skillID, startTime, endTime, friendsIDs) {
    const lang = langManager.curr['activity'];

    const startTimeRounded = RoundTimeTo(TIME_STEP_MINUTES, startTime, 'near');
    const endTimeRounded = RoundTimeTo(TIME_STEP_MINUTES, endTime, 'near');

    const delta = endTimeRounded - startTimeRounded;
    let duration = MinMax(MIN_TIME_MINUTES, delta / 60, MAX_TIME_MINUTES);

    // Get the max duration possible
    const activities = user.activities.Get(true);
    while (!user.activities.TimeIsFree(startTimeRounded, duration, activities)) {
        duration -= TIME_STEP_MINUTES;
        if (duration <= 0) {
            return new Promise((resolve) => {
                user.interface.ChangePage('display', {
                    args: {
                        icon: 'close-filled',
                        text: lang['display-fail-text'].replace('{}', 'time'),
                        button: lang['display-fail-button'],
                        action: () => resolve(false)
                    },
                    storeInHistory: false
                });
            });
        }
    }

    /** @type {Activity} */
    const newActivity = {
        skillID: skillID,
        startTime: startTimeRounded,
        duration: duration,
        comment: '',
        timezone: 0,
        addedType: 'start-now',
        addedTime: 0,
        friends: friendsIDs,
        notifyBefore: null
    };

    return AddActivity(newActivity);
}

/**
 * @param {Activity} activity
 * @returns {Promise<boolean>} True if activity was added successfully
 */
async function AddActivity(activity) {
    const lang = langManager.curr['activity'];

    // Ox brought by the activity (preview of the server settlement, computed before it is queued)
    const oxPreview = user.activities.GetOxReward(activity);

    const { status, activity: addedActivity } = user.activities.Add({
        skillID: activity.skillID,
        startTime: activity.startTime,
        duration: activity.duration,
        comment: activity.comment,
        timezone: 0,
        addedType: activity.addedType,
        addedTime: 0,
        friends: activity.friends,
        notifyBefore: activity.notifyBefore
    });

    // Manage errors
    if (status === 'notFree') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-wrongtiming-title'],
                message: lang['alert-wrongtiming-message']
            }
        });
        return false;
    } else if (status === 'tooEarly') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-tooearly-title'],
                message: lang['alert-tooearly-message']
            }
        });
        return false;
    } else if (status !== 'added') {
        user.interface.console?.AddLog('error', `Utils/Activities.Add Status unknown: ${status}`);
        return false;
    }

    // Update missions
    user.missions.SetMissionState('mission1', 'completed');

    // Get the skill to display the activity
    const skill = dataManager.skills.GetByID(activity.skillID);

    // Skill not found
    if (skill === null) {
        user.interface.ChangePage('display', {
            args: {
                icon: 'close-filled',
                text: lang['display-fail-text'].replace('{}', 'skill not found'),
                button: lang['display-fail-button'],
                action: Back
            },
            storeInHistory: false
        });
        return false;
    }

    if (user.server2.IsAuthenticated()) {
        const saved = await user.activities.SaveOnline();
        if (!saved) {
            // Refused by the server (negative balance, price changed): already explained there.
            // Additions are never refused for their price, so this one is simply not saved yet.
            if (user.activities.lastSaveOnlineError === null) {
                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['alert-error-title'],
                        message: lang['alert-error-message'].replace('{}', 'save online')
                    }
                });
                return false;
            }
        }
    }

    // Setup notifications
    if (activity.notifyBefore !== null) {
        const timestamp = GetDate(activity.startTime - activity.notifyBefore * 60).getTime();
        const notifContent = user.activities.GetNotificationContent(activity);
        user.notificationsPush.CreateTrigger(
            'activityNotifications',
            {
                id: notifContent.id,
                title: notifContent.title,
                body: notifContent.body
            },
            timestamp
        );
    }

    // Offer a rewarded ad to make the activity pay 1.5x. Every condition must hold: without a
    // server ID (offline, save refused) there is nothing to boost, a planned activity is due 0
    // server-side even though the preview shows it as if done, and a day already at 12h brings
    // nothing. The amount is only a preview: the server recomputes it.
    const savedActivity = user.activities.GetSavedByStartTime(activity.startTime);
    const oxBonusPreview = AdBonusOx(oxPreview);

    // Raid points of the activity: local preview first (no critical), then the server value
    const raidStatus = user.raids.GetStatus();
    const raidPreview = raidStatus === 'fighting' || raidStatus === 'healing' ? user.raids.PreviewHit(activity) : null;

    // Ox granted by the ad, 0 until it has been watched. Shared by the mention and the button:
    // the `args` below are captured once, only a watched value can make the total follow.
    const bonusOx = new DynamicVar(0);
    const canBoost =
        savedActivity !== null &&
        oxBonusPreview > 0 &&
        activity.startTime <= GetLocalTime() &&
        user.server2.IsAuthenticated() &&
        user.informations.activityBonusRemaining > 0;

    // Display the activity
    user.interface.ChangePage('display', {
        args: {
            icon: 'zap',
            text: lang['display-activity-text'],
            additionalContent:
                oxPreview !== 0 || raidPreview !== null ? (
                    <View>
                        {oxPreview !== 0 && <BonusOxMention baseOx={oxPreview} bonusOx={bonusOx} />}
                        <RaidPointsMention preview={raidPreview} />
                    </View>
                ) : undefined,
            additionalButton: canBoost ? (
                <BonusOxAdButton activityID={savedActivity.ID} oxBonusPreview={oxBonusPreview} bonusOx={bonusOx} />
            ) : undefined,
            quote: dataManager.quotes.GetRandomQuote(),
            button: lang['display-activity-button'],
            button2: lang['display-activity-button2'],
            action: async () => {
                // Go back
                await Back();

                // Move the calendar to the new day
                const calendar = user.interface.GetPage('calendar');
                if (calendar !== null) {
                    const activityDate = GetDate(activity.startTime);
                    const day = activityDate.getDate();
                    const month = activityDate.getMonth();
                    const year = activityDate.getFullYear();
                    const newDay = calendar.state.days.find(
                        (d) => d.day === day && d.month === month && d.year === year
                    );
                    if (newDay) {
                        calendar.onDayPress(newDay);
                    }
                }
            },
            action2: async () => {
                // Go back
                await Back();

                // Get the start time of the next activity
                let startTime;
                if (addedActivity) {
                    startTime = addedActivity.startTime + addedActivity.duration * 60;
                }

                // Open the add activity view
                user.interface.bottomPanel?.Open({
                    content: <AddActivityView time={startTime} />
                });
            }
        },
        storeInHistory: false
    });

    return true;
}

/**
 * @param {Activity} oldActivity
 * @param {Activity} newActivity
 * @param {boolean} confirm
 * @returns {Promise<boolean>} True if activity was edited successfully
 */
async function EditActivity(oldActivity, newActivity, confirm = false) {
    const lang = langManager.curr['activity'];

    // Price of the edition; a costly one is refused while the balance is negative
    const quote = user.activities.GetEditOxQuote(oldActivity, newActivity);
    if (user.activities.IsOxOperationBlocked(quote)) {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-ox-negative-title'],
                message: lang['alert-ox-negative-message']
            }
        });
        return false;
    }

    const { status, activity } = user.activities.Edit(oldActivity, newActivity, confirm);

    // Manage confirmation
    if (status === 'needConfirmation') {
        let message = lang['alert-needconfirmation-message'];
        if (quote.total > 0) {
            message += ' ' + lang['alert-needconfirmation-cost'].replace('{}', quote.total.toString());
        }
        return new Promise((resolve) => {
            user.interface.popup?.OpenT({
                type: 'yesno',
                data: {
                    title: lang['alert-needconfirmation-title'],
                    message
                },
                callback: async (button) => {
                    if (button === 'yes') {
                        resolve(EditActivity(oldActivity, newActivity, true));
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }

    // Manage errors
    else if (status === 'notFree') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-wrongtiming-title'],
                message: lang['alert-wrongtiming-message']
            }
        });
        return false;
    } else if (status === 'tooEarly') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-alreadyexist-title'],
                message: lang['alert-alreadyexist-message']
            }
        });
        return false;
    } else if (status !== 'edited' || activity === null) {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-error-title'],
                message: lang['alert-error-message'].replace('{}', status)
            }
        });
        return false;
    }

    if (user.server2.IsAuthenticated()) {
        const saved = await user.activities.SaveOnline();
        if (!saved) {
            // Refused by the server (negative balance, price changed): when THIS edition is the
            // one that was cancelled, it is already reverted and explained by the data layer
            if (user.activities.lastSaveOnlineError !== null) {
                if (user.activities.WasOxOperationDiscarded(oldActivity)) {
                    return false;
                }
            } else {
                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['alert-error-title'],
                        message: lang['alert-error-message'].replace('{}', 'save online')
                    }
                });
            }
        }
    }

    // Setup notifications
    if (oldActivity.notifyBefore !== null) {
        const notifContent = user.activities.GetNotificationContent(oldActivity);
        await user.notificationsPush.Remove(notifContent.id);
    }
    if (newActivity.notifyBefore !== null) {
        const timestamp = GetDate(newActivity.startTime - newActivity.notifyBefore * 60).getTime();
        const notifContent = user.activities.GetNotificationContent(newActivity);
        await user.notificationsPush.CreateTrigger(
            'activityNotifications',
            {
                id: notifContent.id,
                title: notifContent.title,
                body: notifContent.body
            },
            timestamp
        );
    }

    return true;
}

/**
 * @param {Activity} activity
 * @returns {Promise<'removed' | 'cancel' | 'error'>} True if activity was removed successfully
 */
async function RemoveActivity(activity) {
    const lang = langManager.curr['activity'];

    // Price of the deletion; a costly one is refused while the balance is negative
    const quote = user.activities.GetDeleteOxQuote(activity);
    if (user.activities.IsOxOperationBlocked(quote)) {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-ox-negative-title'],
                message: lang['alert-ox-negative-message']
            }
        });
        return 'cancel';
    }

    let message = lang['alert-remove-message'];
    if (quote.total > 0) {
        message += '\n\n' + lang['alert-remove-cost'].replace('{}', quote.total.toString());
    } else if (quote.delta > 0) {
        message += '\n\n' + lang['alert-remove-gain'].replace('{}', quote.delta.toString());
    }

    return new Promise((resolve) => {
        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-remove-title'],
                message
            },
            callback: (button) => {
                // Popup closed
                if (button !== 'yes') {
                    resolve('cancel');
                    return;
                }

                const removedStatus = user.activities.Remove(activity);

                // Manage errors
                if (removedStatus === 'notExist' || removedStatus !== 'removed') {
                    user.interface.popup?.OpenT({
                        type: 'ok',
                        data: {
                            title: lang['alert-error-not-exist-title'],
                            message: lang['alert-error-not-exist-message']
                        }
                    });
                    resolve('error');
                    return;
                }

                // Remove notifications
                if (activity.notifyBefore !== null) {
                    const notifContent = user.activities.GetNotificationContent(activity);
                    user.notificationsPush.Remove(notifContent.id);
                }

                resolve('removed');
            }
        });
    });
}

/**
 * @returns {Promise<void>}
 */
function Back() {
    return new Promise((resolve) => {
        if (user.interface.history.length === 0 || user.interface.GetCurrentPageName() === 'activitytimer') {
            user.interface.ChangePage('calendar', { callback: resolve });
            return;
        } else {
            user.interface.BackHandle({ callback: resolve });
        }
    });
}

export {
    TIME_STEP_MINUTES,
    MIN_TIME_MINUTES,
    MAX_TIME_MINUTES,
    StartActivityNow,
    AddActivityNow,
    AddActivity,
    EditActivity,
    RemoveActivity
};
