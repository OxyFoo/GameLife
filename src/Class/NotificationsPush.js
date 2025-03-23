import notifee, { AndroidImportance, AndroidVisibility, AuthorizationStatus, TriggerType } from '@notifee/react-native';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { IUserClass } from 'Types/Interface/IUserClass';

import { DateFormat } from 'Utils/Date';
import { GetLocalTime } from 'Utils/Time';
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
                name: langManager.curr['notifications']['channels']['regular']['name'],
                importance: AndroidImportance.DEFAULT,
                visibility: AndroidVisibility.PUBLIC,
                sound: 'default',
                badge: false
            },
            {
                id: 'activityNotifications',
                name: langManager.curr['notifications']['channels']['activity']['name'],
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
                '[PushNotifications] Total notifications:',
                notifications.length
            );
            if (notifications.length > MAX_NOTIFICATIONS) {
                this.#user.interface.console?.AddLog('warn', 'Too many notifications');
            }
        } catch (error) {
            this.#user.interface.console?.AddLog('error', 'Error getting trigger notifications:', error);
        }
    };

    SetupRegularNotifications = async () => {
        const now = GetLocalTime();
        const time_notifs_start = performance.now();
        const lastUpdate = this.#user.settings.regularNotificationsLastRefresh;

        // Check if the last update was more than 24h ago
        if (lastUpdate !== 0 && now - lastUpdate <= 24 * 60 * 60 * 1000) {
            return;
        }

        // Refresh notifications if needed
        if (this.#user.settings.morningNotifications) {
            await this.#user.notificationsPush.ScheduleMorningNotifs();
        }
        if (this.#user.settings.eveningNotifications) {
            await this.#user.notificationsPush.ScheduleEveningNotifs();
        }

        // Log
        const time_notifs_end = performance.now();
        const time_notifs = Round(time_notifs_end - time_notifs_start, 2);
        this.#user.interface.console?.AddLog('info', `Notifications loaded in ${time_notifs}ms`);

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
                const title = langManager.curr['notifications']['morning']['title'];
                const anonymousAuthors = langManager.curr['quote']['anonymous-author-list'];
                const quote = dataManager.quotes.GetRandomQuote();
                if (quote === null) {
                    this.#user.interface.console?.AddLog('warn', 'No quote found');
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
                const title = langManager.curr['notifications']['evening']['title'];
                const messages = langManager.curr['notifications']['evening']['messages'];
                const body = messages[Random(0, messages.length)];

                await this.CreateTrigger('regularNotifications', { id, title, body }, eveningTimestamp.getTime());
            }

            eveningTimestamp.setDate(eveningTimestamp.getDate() + i);
        }
    };

    /**
     * @param {ChannelId} channelId
     * @param {Notification} notif
     * @param {number} timestamp Timestamp in milliseconds
     * @returns {Promise<string | null>} Notification ID or null if error
     */
    async CreateTrigger(channelId, notif, timestamp = Date.now()) {
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
                    timestamp: timestamp
                }
            );
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
            this.#user.interface.console?.AddLog('info', '[PushNotifications] Notification removed:', notifID);
        } catch (error) {
            this.#user.interface.console?.AddLog('error', '[PushNotifications] Error removing notification:', error);
        }
    }

    async RemoveAll() {
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
                error.message
            );
        }
    }
}

export default NotificationsPush;
