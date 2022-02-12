import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

import langManager from '../Managers/LangManager';
import dataManager from '../Managers/DataManager';

import { Random } from './Functions';

const CHANNEL_ID = '1';
const SET_HOUR = 9;
const MAX_DAYS = 30;

async function __checkPermissionsIOS(forcePopup = false) {
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
}

function __initNotification() {
    if (Platform.OS === "ios") PushNotificationIOS.removeAllPendingNotificationRequests();
    else if (Platform.OS === "android") PushNotification.cancelAllLocalNotifications();

    // Define SET_HOUR h tomorrow
    const date = new Date();
    const hour = date.getHours();
    if (hour > SET_HOUR) date.setDate(date.getDate() + 1);
    date.setHours(SET_HOUR, 21, 0, 0);

    // Set all notifications for MAX_DAYS days
    for (let i = 0; i < MAX_DAYS; i++) {
        const titles = langManager.curr['notifications']['titles'];
        const random_title = Random(0, titles.length - 1);
        const Title = titles[random_title];

        const quote = dataManager.quotes.GetRandomQuote();
        const Body = quote.Quote + ' (' + quote.Author + ')';

        if (Platform.OS === "ios") {
            PushNotificationIOS.addNotificationRequest({
                id: i,
                title: Title,
                body: Body,
                fireDate: date,
                isCritical: false
            });
        } else if (Platform.OS === "android") {
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

async function EnableMorningNotifications(forcePopup = false) {
    let enabled = true;

    if (Platform.OS === "ios") {
        const authorized = await __checkPermissionsIOS(forcePopup);
        if (authorized) __initNotification();
        else enabled = false;
    } else if (Platform.OS === "android") {
        PushNotification.channelExists(CHANNEL_ID, (exists) => {
            if (!exists) {
                PushNotification.createChannel({
                    channelId: CHANNEL_ID,
                    channelName: 'Quotes notifications'
                }, (created) => {
                    if (created) {
                        __initNotification();
                    } else {
                        enabled = false;
                    }
                });
            } else {
                __initNotification();
            }
        });
    }

    return enabled;
}

function DisableMorningNotifications() {
    let removed = false;
    if (Platform.OS === "ios") {
        PushNotificationIOS.removeAllPendingNotificationRequests();
    } else if (Platform.OS === "android") {
        PushNotification.channelExists(CHANNEL_ID, (exists) => {
            if (exists) {
                PushNotification.deleteChannel(CHANNEL_ID);
                removed = true;
            }
        });
    }
    return removed;
}

export { EnableMorningNotifications, DisableMorningNotifications }