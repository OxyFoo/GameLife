import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import dataManager from '../Managers/DataManager';

import { ParsePlural } from './String';
import { GetTime } from './Time';
import { Random, Range } from './Functions';

const MAX_DAYS = 30;

const Management = {
    async checkPermissionsIOS(forcePopup = false) {
        let authorization = false;
        const perms = { alert: true, badge: true, sound: true, critical: true };
        const currPerms = await new Promise((resolve) => {
            PushNotificationIOS.checkPermissions(currPerms => {
                resolve(currPerms.authorizationStatus);
            });
        });
        if (currPerms >= 2) {
            authorization = true;
        } else if (currPerms === 0 || (currPerms === 1 && forcePopup)) {
            const output = await PushNotificationIOS.requestPermissions(perms);
            if (output.authorizationStatus >= 2) authorization = true;
        }
        return authorization;
    },
    async addChannelAndroid(channelId, channelName) {
        let output = true;

        let exists = await new Promise((resolve) => {
            PushNotification.channelExists(channelId, resolve);
        });

        if (!exists) {
            output = await new Promise((resolve) => {
                const channel = { channelId, channelName };
                PushNotification.createChannel(channel, resolve);
            });
        }

        return output;
    },
    async removeChannelAndroid(channelId) {
        let exists = await new Promise((resolve) => {
            PushNotification.channelExists(channelId, resolve);
        });
        if (exists) PushNotification.deleteChannel(channelId);
    }
};

/** @param {Notification} notif */
async function Setup(notif) {
    let enabled = false;

    if (Platform.OS === 'ios') {
        await Remove(notif, false); // notif.Disable();
        enabled = await Management.checkPermissionsIOS();
    } else if (Platform.OS === 'android') {
        await Remove(notif, false); // notif.Disable();
        const lang = langManager.curr['notifications'];
        const channelId = notif.ID;
        const channelName = lang.hasOwnProperty(channelId) ? lang[channelId]['name'] : channelId;
        enabled = await Management.addChannelAndroid(channelId, channelName);
    } else {
        user.interface.console.AddLog('warn', 'Notifications.Setup', `Platform ${Platform.OS} is not supported`);
    }

    if (enabled) await AddNotifications(notif);
    return enabled;
}

/** @param {Notification} notif */
async function AddNotifications(notif) {
    const { ID, __generate, hour, minutes } = notif;

    // Define SET_HOUR h tomorrow
    const date = new Date();
    date.setHours(hour, minutes, 0, 0);

    // Set all notifications for MAX_DAYS days
    for (let i = 0; i < MAX_DAYS; i++) {
        const content = __generate(i, date);

        if (content !== null) {
            const { Title, Body } = content;

            if (Platform.OS === 'ios') {
                PushNotificationIOS.addNotificationRequest({
                    id: `${ID}-${i}`,
                    title: Title,
                    body: Body,
                    fireDate: date,
                    isCritical: false
                });
            } else if (Platform.OS === 'android') {
                PushNotification.localNotificationSchedule({
                    //id: `${ID}-${i}`,
                    channelId: ID,
                    title: Title,
                    message: Body,
                    date: date
                });
            }
        }

        date.setDate(date.getDate() + 1);
    }
}

/**
 * @returns {Promise<NotificationRequest[]|PushNotificationScheduledLocalObject[]>}
 */
function GetAllNotifications() {
    return new Promise((resolve) => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.getPendingNotificationRequests(resolve);
        } else if (Platform.OS === 'android') {
            PushNotification.getScheduledLocalNotifications(resolve);
        }
    });
}

/**
 * @param {Notification} notif
 * @param {boolean} removeChannel Used to remove channel (android only)
 * @returns {Promise<void>}
 */
async function Remove(notif, removeChannel = true) {
    const { ID } = notif;

    const allNotifs = await GetAllNotifications();
    const IDs = Range(MAX_DAYS).map(i => ID + i.toString()).filter(id => allNotifs.find(notif => notif.id === id));

    if (Platform.OS === 'ios') {
        PushNotificationIOS.removePendingNotificationRequests(IDs);
    } else if (Platform.OS === 'android') {
        IDs.forEach(id => PushNotification.cancelLocalNotification(id));
        await Management.removeChannelAndroid(ID);
    }
}

/**
 * @typedef {object} Notification
 * @property {string} ID Channel ID for android
 * @property {number} hour Hour of the day [0, 23]
 * @property {number} [minutes=0] Minutes of the hour [0, 59]
 * @property {(index: number, date: Date) => { Title: string, Body: string } | null} __generate Function to generate notification content
 *
 * @property {() => Promise<boolean>} Enable
 * @property {() => Promise<void>} Disable
 * @property {() => Promise<void>} RemoveToday (only for Evening notifications)
 */

class Notifications {
    /** @type {Notification} */
    static Morning = {
        ID: 'morning',
        hour: 9,
        minutes: 0,
        __generate: (index) => {
            if (index === 0) return null;
            const Title = langManager.curr['notifications']['morning']['title'];
            const quote = dataManager.quotes.GetRandomQuote();
            const Body = quote.Quote + ' (' + quote.Author + ')';
            return { Title, Body };
        },

        Enable: () => Setup(Notifications.Morning),
        Disable: () => Remove(Notifications.Morning)
    };

    /** @type {Notification} */
    static Evening = {
        ID: 'evening',
        hour: 19,
        minutes: 0,
        __generate: (index) => {
            if (index === 0) return null;
            const Title = langManager.curr['notifications']['evening']['title'];
            const messages = langManager.curr['notifications']['evening']['messages'];
            const Body = messages[Random(0, messages.length)];
            return { Title, Body };
        },

        Enable: () => Setup(Notifications.Evening),
        Disable: () => Remove(Notifications.Evening),
        RemoveToday: () => {} // TODO
    }

    /** @type {Notification} */
    static Tasks = {
        ID: 'tasks',
        hour: 10,
        minutes: 0,
        __generate: () => {
            // TODO - Finish that
            return null;
            const now = GetTime();
            const day = 24 * 60 * 60;
            const tasks = user.tasks.Get();
            let halftime = {}, tomorrow = {}, today = {};

            for (let i = 0; i < tasks.length; i++) {
                const { Title, Checked, Starttime, Deadline, Schedule } = tasks[i];
                if (Checked || Deadline < Starttime) continue;

                const midTime = (Deadline - Starttime) / 2;
                if (Schedule !== null) {
                } else if (Deadline !== null) {
                    if (Deadline > now && Deadline < now + day) {
                        // Today
                    } else if (Deadline < now && Deadline > now - day) {
                        // Tomorrow
                    } else if (midTime > now && midTime < now + day) {
                        // Mid date
                    }
                    const date = Deadline;
                    
                }
            }
            //ParsePlural()
            return null;
        },

        Enable: () => Setup(Notifications.Tasks),
        Disable: () => Remove(Notifications.Tasks)
    }

    static async DisableAll() {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllPendingNotificationRequests();
        } else if (Platform.OS === 'android') {
            PushNotification.cancelAllLocalNotifications();
        }
    }

    // TODO - Remove, only for testing
    static GetAllNotifications() {
        return new Promise((resolve) => {
            if (Platform.OS === 'ios') {
                PushNotificationIOS.getPendingNotificationRequests(resolve);
            } else if (Platform.OS === 'android') {
                PushNotification.getScheduledLocalNotifications(resolve);
            }
        });
    }
}

export default Notifications;