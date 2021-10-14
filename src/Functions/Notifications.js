import PushNotification from 'react-native-push-notification';

import langManager from '../Managers/LangManager';
import user from '../Managers/UserManager';

const CHANNEL_ID = '1';
const SET_HOUR = 9;
const MAX_DAYS = 30;

function enableMorningNotifications() {
    let enabled = true;
    PushNotification.channelExists(CHANNEL_ID, (exists) => {
        if (!exists) {
            PushNotification.createChannel({
                channelId: CHANNEL_ID,
                channelName: 'Quotes notifications'
            }, (created) => {
                if (created) {
                    InitNotification();
                } else {
                    enabled = false;
                }
            });
        } else {
            InitNotification();
        }
    });
    return enabled;
}

function InitNotification() {
    PushNotification.cancelAllLocalNotifications();

    // Define SET_HOUR h tomorrow
    const date = new Date();
    const hour = date.getHours();
    if (hour > SET_HOUR) date.setDate(date.getDate() + 1);
    date.setHours(SET_HOUR, 21, 0, 0);

    // Set all notifications for MAX_DAYS days
    for (let _ = 0; _ < MAX_DAYS; _++) {
        const titles = langManager.curr['notifications']['titles'];
        const quotes = user.quotes;

        const random_title = user.random(0, titles.length - 1);
        const random_quote = user.random(0, quotes.length - 1);
        const Title = titles[random_title];
        const { Quote, Author } = quotes[random_quote];


        PushNotification.localNotificationSchedule({
            channelId: CHANNEL_ID,
            title: Title,
            message: Quote + ' (' + Author + ')',
            date: date
        });

        date.setDate(date.getDate() + 1);
    }
}

function disableMorningNotifications() {
    let removed = false;
    PushNotification.channelExists(CHANNEL_ID, (exists) => {
        if (exists) {
            PushNotification.deleteChannel(CHANNEL_ID);
            removed = true;
        }
    });
    return removed;
}

export { enableMorningNotifications, disableMorningNotifications }