import notifee, {
    AlarmType,
    AndroidImportance,
    AndroidVisibility,
    AuthorizationStatus,
    TriggerType
} from '@notifee/react-native';

import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { IUserClass } from 'Types/Interface/IUserClass';

import { DateFormat } from 'Utils/Date';
import { GetDate, GetLocalTime } from 'Utils/Time';
import { DeepMerge } from 'Utils/Object';
import { Random, Round } from 'Utils/Functions';

/**
 * @typedef {import('@notifee/react-native').AndroidChannel} AndroidChannel
 * @typedef {import('@notifee/react-native').Notification} Notification
 * @typedef {import('@notifee/react-native').NotificationSettings} NotificationSettings
 *
 * @typedef {import('Managers/UserManager').default} UserManager
 */

/**
 * @typedef {'regularNotifications' | 'activityNotifications'} ChannelId
 */

const MAX_DAYS = 30;

/** Show warning if too many notifications */
const MAX_NOTIFICATIONS = 100;

class NotificationsPush extends IUserClass {
    /** @type {UserManager} */
    #user;

    /** @type {NotificationSettings | null} */
    #notificationPermissions = null;

    /** @param {UserManager} user */
    constructor(user) {
        super('notifications-push');

        this.#user = user;
    }

    Initialize = async () => {
        // Request permissions
        try {
            this.#notificationPermissions = await notifee.requestPermission();
            if (this.#notificationPermissions.authorizationStatus === AuthorizationStatus.DENIED) {
                return;
            }
            this.#user.interface.console?.AddLog('info', '[PushNotifications] Permission granted');
        } catch (error) {
            this.#user.interface.console?.AddLog('error', '[PushNotifications] Error requesting permission:', error);
            return;
        }

        // Load all channels

        /** @type {(AndroidChannel & { id: ChannelId })[]} */
        const CHANNELS = [
            {
                id: 'regularNotifications',
                name: langManager.curr['notifications']['regular']['name'],
                importance: AndroidImportance.DEFAULT,
                visibility: AndroidVisibility.PUBLIC,
                sound: 'default',
                badge: false
            },
            {
                id: 'activityNotifications',
                name: langManager.curr['notifications']['activities']['name'],
                importance: AndroidImportance.DEFAULT,
                visibility: AndroidVisibility.PUBLIC,
                sound: 'default',
                badge: true
            }
        ];

        try {
            for (const channel of CHANNELS) {
                // Check if the channel already exists
                const channelExists = await notifee.getChannel(channel.id);
                if (channelExists) {
                    continue;
                }

                // Create the channel
                await notifee.createChannel(channel);
            }
        } catch (error) {
            this.#user.interface.console?.AddLog('error', '[PushNotifications] Error creating channels:', error);
            return;
        }

        // Check if too many notifications
        try {
            const notifications = await notifee.getTriggerNotifications();
            this.#user.interface.console?.AddLog(
                'info',
                '[PushNotifications] Loaded trigger notifications:',
                notifications.length
            );
            if (notifications.length > MAX_NOTIFICATIONS) {
                this.#user.interface.console?.AddLog('warn', '[PushNotifications] Too many notifications');
            }
        } catch (error) {
            this.#user.interface.console?.AddLog(
                'error',
                '[PushNotifications] Error getting trigger notifications:',
                error
            );
        }
    };

    /**
     * Resets and sets up notifications based on user settings.
     * - Runs once per day.
     * - Clears current notifications and reschedules morning, evening, and activity reminders.
     * - Logs execution time and updates the last refresh timestamp.
     *
     * @returns {Promise<void>}
     */
    SetupAllNotifications = async () => {
        const now = GetLocalTime();
        const time_notifs_start = performance.now();
        const lastUpdate = this.#user.settings.regularNotificationsLastRefresh;

        // Check if the last update was more than 24h ago
        if (lastUpdate !== 0 && now - lastUpdate <= 24 * 60 * 60 * 1000) {
            this.#user.interface.console?.AddLog('info', '[PushNotifications] Notifications already set up today');
            return;
        }

        // Clear all notifications
        await this.Clear();

        // Refresh notifications if needed
        if (this.#user.settings.morningNotifications) {
            await this.#user.notificationsPush.ScheduleMorningNotifs();
        }
        if (this.#user.settings.eveningNotifications) {
            await this.#user.notificationsPush.ScheduleEveningNotifs();
        }

        // Refresh activities notifications
        await this.#user.notificationsPush.ScheduleActivitiesNotifs();

        // Log
        const notifs = await notifee.getTriggerNotifications();
        const time_notifs_end = performance.now();
        const time_notifs = Round(time_notifs_end - time_notifs_start, 2);
        this.#user.interface.console?.AddLog(
            'info',
            `[PushNotifications] ${notifs.length} notifications loaded in ${time_notifs}ms`
        );

        // Update last refresh
        this.#user.settings.regularNotificationsLastRefresh = now;
        await this.#user.settings.IndependentSave();
    };

    ScheduleMorningNotifs = async () => {
        const now = new Date();
        const morningTimestamp = new Date();
        morningTimestamp.setHours(9, 0, 0, 0);

        for (let i = 0; i < MAX_DAYS; i++) {
            if (morningTimestamp.getTime() > now.getTime()) {
                const title = langManager.curr['notifications']['regular']['title'];
                const anonymousAuthors = langManager.curr['quote']['anonymous-author-list'];
                const quote = dataManager.quotes.GetRandomQuote();
                if (quote === null) {
                    this.#user.interface.console?.AddLog(
                        'warn',
                        '[PushNotifications] No quote found for morning notification generation'
                    );
                    return;
                }

                const DDMM = DateFormat(morningTimestamp, 'DD-MM');
                const id = `morning-${DDMM}`;
                const text = langManager.GetText(quote.Quote);
                const author = quote.Author || anonymousAuthors[Random(0, anonymousAuthors.length)];
                const body = `${text} (${author})`;

                await this.CreateTrigger('regularNotifications', { id, title, body }, morningTimestamp.getTime());
            }

            morningTimestamp.setDate(morningTimestamp.getDate() + i);
        }
    };

    ScheduleEveningNotifs = async () => {
        const now = new Date();
        const eveningTimestamp = new Date();
        eveningTimestamp.setHours(19, 0, 0, 0);

        for (let i = 0; i < MAX_DAYS; i++) {
            if (eveningTimestamp.getTime() > now.getTime()) {
                const DDMM = DateFormat(eveningTimestamp, 'DD-MM');
                const id = `evening-${DDMM}`;
                const title = langManager.curr['notifications']['regular']['title'];
                const messages = langManager.curr['notifications']['regular']['messages'];
                const body = messages[Random(0, messages.length)];

                await this.CreateTrigger('regularNotifications', { id, title, body }, eveningTimestamp.getTime());
            }

            eveningTimestamp.setDate(eveningTimestamp.getDate() + i);
        }
    };

    ScheduleActivitiesNotifs = async () => {
        const now = GetLocalTime();
        const activities = this.#user.activities
            .Get()
            .filter((activity) => activity.startTime > now && activity.notifyBefore !== null);

        for (const activity of activities) {
            if (activity.notifyBefore !== null) {
                const timestamp = GetDate(activity.startTime - activity.notifyBefore * 60).getTime();
                const notifContent = this.#user.activities.GetNotificationContent(activity);
                this.CreateTrigger(
                    'activityNotifications',
                    {
                        id: notifContent.id,
                        title: notifContent.title,
                        body: notifContent.body
                    },
                    timestamp
                );
            }
        }
    };

    /**
     * @param {ChannelId} channelId
     * @param {Notification} notif
     * @param {number} timestamp Timestamp in milliseconds
     * @returns {Promise<string | null>} Notification ID or null if error
     */
    async CreateTrigger(channelId, notif, timestamp = Date.now()) {
        // Check if the user has denied notifications
        if (this.#notificationPermissions?.authorizationStatus === AuthorizationStatus.DENIED) {
            this.#user.interface.console?.AddLog('warn', '[PushNotifications] Notifications denied');
            return null;
        }

        // Check if the timestamp is in the past
        const now = new Date();
        if (timestamp < now.getTime()) {
            this.#user.interface.console?.AddLog(
                'warn',
                '[PushNotifications] Timestamp is in the past, not creating notification'
            );
            return null;
        }

        // Schedule the notification
        try {
            const notificationID = await notifee.createTriggerNotification(
                DeepMerge(
                    /** @type {Notification} */
                    ({
                        title: 'Notification Title update',
                        body: 'Main body content of the notification',
                        android: {
                            channelId,
                            pressAction: {
                                id: 'default'
                            },
                            color: '#0000FF'
                        }
                    }),
                    notif
                ),
                {
                    type: TriggerType.TIMESTAMP,
                    timestamp: timestamp,
                    alarmManager: {
                        type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE
                    }
                }
            );
            // this.#user.interface.console?.AddLog('info', '[PushNotifications] Notification created:', notificationID);
            return notificationID;
        } catch (error) {
            this.#user.interface.console?.AddLog(
                'error',
                '[PushNotifications] Error creating trigger notification:',
                // @ts-ignore
                error.message
            );
            return null;
        }
    }

    /** @param {string} notifID */
    async Remove(notifID) {
        if (this.#notificationPermissions?.authorizationStatus === AuthorizationStatus.DENIED) {
            return;
        }

        try {
            await notifee.cancelTriggerNotification(notifID);
            // this.#user.interface.console?.AddLog('info', '[PushNotifications] Notification removed:', notifID);
        } catch (error) {
            this.#user.interface.console?.AddLog('error', '[PushNotifications] Error removing notification:', error);
        }
    }

    /** @param {ChannelId} channelId */
    async RemoveByChannel(channelId) {
        if (this.#notificationPermissions?.authorizationStatus === AuthorizationStatus.DENIED) {
            return;
        }

        try {
            const triggerNotifs = await notifee.getTriggerNotifications();
            const toRemove = triggerNotifs.filter(({ notification }) => notification.android?.channelId === channelId);

            for (const notif of toRemove) {
                if (notif.notification.id) {
                    await notifee.cancelTriggerNotification(notif.notification.id);
                }
            }

            this.#user.interface.console?.AddLog(
                'info',
                `[PushNotifications] Notifications removed by channel: ${channelId} (count: ${toRemove.length})`
            );
        } catch (error) {
            this.#user.interface.console?.AddLog(
                'error',
                '[PushNotifications] Error removing notifications by channel:',
                error
            );
        }
    }

    Clear = async () => {
        if (this.#notificationPermissions?.authorizationStatus === AuthorizationStatus.DENIED) {
            return;
        }

        try {
            await notifee.cancelAllNotifications();
        } catch (error) {
            this.#user.interface.console?.AddLog(
                'error',
                '[PushNotifications] Error removing all notifications:',
                // @ts-ignore
                error?.message || error
            );
        }
    };
}

export default NotificationsPush;
