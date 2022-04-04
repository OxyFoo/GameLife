import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import dataManager from '../Managers/DataManager';

import { Random } from './Functions';

const CHANNELS_ID = {
    morning: 'morning',
    evening: 'evening'
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
        } else if (currPerms === 1 || (currPerms === 1 && forcePopup)) {
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

function InitMornings() {
    if (Platform.OS === 'ios') PushNotificationIOS.removeAllPendingNotificationRequests();
    else if (Platform.OS === 'android') PushNotification.cancelAllLocalNotifications();

    // Define SET_HOUR h tomorrow
    const date = new Date();
    const hour = date.getHours();
    if (hour > SET_HOUR) date.setDate(date.getDate() + 1);
    date.setHours(SET_HOUR, 0, 0, 0);

    // Set all notifications for MAX_DAYS days
    for (let i = 0; i < MAX_DAYS; i++) {
        const titles = langManager.curr['notifications']['titles'];
        const random_title = Random(0, titles.length - 1);
        const Title = titles[random_title];

        const quote = dataManager.quotes.GetRandomQuote();
        const Body = quote.Quote + ' (' + quote.Author + ')';

        if (Platform.OS === 'ios') {
            PushNotificationIOS.addNotificationRequest({
                title: Title,
                body: Body,
                fireDate: date,
                isCritical: false
            });
        } else if (Platform.OS === 'android') {
            PushNotification.localNotificationSchedule({
                channelId: CHANNEL_ID,
                title: Title,
                message: Body,
                date: date
            });
        }

        date.setDate(date.getDate() + 1);
    }
}

/**
 * @description - Remove channel id for android and remove all pending notifications for ios
 * @param {string} channelID Used to delete android channel by ID, not used on iOS
 */
function Remove(channelID) {
    if (Platform.OS === 'ios') {
        PushNotificationIOS.removeAllPendingNotificationRequests();
    } else if (Platform.OS === 'android' && !!channelID) {
        PushNotification.channelExists(channelID, (exists) => {
            if (exists) PushNotification.deleteChannel(channelID);
        });
    }
}

async function Setup(initFunction) {
    if (typeof(initFunction) !== 'function') {
        user.interface.console.AddLog('warn', 'Notifications.Setup', `initFunction is not a function (${initFunction})`);
        return false;
    }

    let enabled = false;
    if (Platform.OS === 'ios') {
        enabled = await Management.checkPermissionsIOS(); // TODO - force popup ?
    } else if (Platform.OS === 'android') {
        enabled = await Management.addChannelAndroid(CHANNEL_ID);
    } else {
        user.interface.console.AddLog('warn', 'Notifications.Setup', `Platform ${Platform.OS} is not supported`);
    }

    if (enabled) initFunction();
    return enabled;
}

class Notifications {
    /**
     * @description Daily notifications at 9am with a random quote to start the day
     */
    static Mornings = {
        Enable: () => Setup(InitMornings),
        Disable: () => Remove(CHANNELS_ID.morning)
    };

    static DisableAll() {
        Notifications.Mornings.Disable();
    }
}

export default Notifications;