import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import dataManager from '../Managers/DataManager';

import { Random, Range } from './Functions';

/**
 * @typedef {Object} Channel
 * @property {String} ID Channel ID for android
 * @property {() => { Title, Body }} generate Function to generate notification content
 * @property {Number} hour Hour of the day [0, 23]
 * @property {Number} [minutes=0] Minutes of the hour [0, 59]
 */

/** @returns {Channel} */
const CreateChannel = (ID, generate, hour, minutes = 0) => ({ ID, generate, hour, minutes });
const CHANNELS = {
    morning: CreateChannel('morning', Notifications.Mornings.generate, 0, 9),
    //evening: CreateChannel('evening', null, 1, 19),
    //tasks:   CreateChannel('tasks',   null, 2, 13),
};

const CHANNEL_ID = '1test';
const SET_HOUR = 9;
const MAX_DAYS = 30;

const Management = {
    async checkPermissionsIOS(forcePopup = false) {
        let authorization = false;
        const perms = { alert: true, badge: true, sound: true, critical: true };
        const currPerms = await new Promise((resolve, reject) => {
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
    async addChannelAndroid(channelID) {
        let output = true;

        let exists = await new Promise((resolve) => {
            PushNotification.channelExists(channelID, resolve);
        });

        if (!exists) {
            output = await new Promise((resolve) => {
                const channel = { channelId: channelID, channelName: 'Quotes notifications' };
                PushNotification.createChannel(channel, resolve);
            });
        }

        return output;
    }
};

/**
 * @param {Channel} channel
 */
async function Setup(channel, ) {
    let enabled = false;
    if (Platform.OS === 'ios') {
        enabled = await Management.checkPermissionsIOS(); // TODO - force popup ?
    } else if (Platform.OS === 'android') {
        enabled = await Management.addChannelAndroid(channel.ID);
    } else {
        user.interface.console.AddLog('warn', 'Notifications.Setup', `Platform ${Platform.OS} is not supported`);
    }

    if (enabled) AddNotifications(channel);
    return enabled;
}

/**
 * @param {Channel} channel
 */
function AddNotifications(channel) {
    const { ID, generate, hour, minutes } = channel;
    // Define SET_HOUR h tomorrow
    const date = new Date();
    date.setHours(hour, minutes, 0, 0);

    // Set all notifications for MAX_DAYS days
    for (let i = 0; i < MAX_DAYS; i++) {
        const { Title, Body } = generate();

        if (Platform.OS === 'ios') {
            PushNotificationIOS.addNotificationRequest({
                id: ID + i.toString(),
                title: Title,
                body: Body,
                fireDate: date,
                isCritical: false
            });
        } else if (Platform.OS === 'android') {
            PushNotification.localNotificationSchedule({
                channelId: ID,
                title: Title,
                message: Body,
                date: date
            });
        }

        date.setDate(date.getDate() + 1);
    }
}

/**
 * @param {Channel} channel
 */
function Remove(channel) {
    const { ID: channelID } = channel;
    if (Platform.OS === 'ios') {
        const IDs = Range(MAX_DAYS).map(i => channelID + i.toString());
        PushNotificationIOS.removePendingNotificationRequests(IDs);
    } else if (Platform.OS === 'android') {
        PushNotification.channelExists(channelID, (exists) => {
            if (exists) PushNotification.deleteChannel(channelID);
        });
    }
}

class Notifications {
    /**
     * @description Daily notifications at 9am with a random quote to start the day
     */
    static Mornings = {
        Enable: () => Setup(CHANNELS.morning),
        Disable: () => Remove(CHANNELS.morning),
        generate: () => {
            const titles = langManager.curr['notifications']['titles'];
            const random_title = Random(0, titles.length - 1);
            const Title = titles[random_title];
            const quote = dataManager.quotes.GetRandomQuote();
            const Body = quote.Quote + ' (' + quote.Author + ')';
            return { Title, Body };
        }
    };

    static DisableAll() {
        Notifications.Mornings.Disable();
    }
}

export default Notifications;