import langManager from '../Managers/LangManager';
import PushNotification from 'react-native-push-notification';
import user from '../Managers/UserManager';

const CHANNEL_ID = '1';
const MAX_DAYS = 15;

function enableNotificationSchedule() {
    PushNotification.channelExists(CHANNEL_ID, (exists) => {
        if (!exists) {
            PushNotification.createChannel({
                channelId: CHANNEL_ID,
                channelName: 'Quotes notifications'
            },
            (created) => {
                if (created) {
                    InitNotification();
                }
            });
        } else {
            InitNotification();
        }
    });
}

function InitNotification() {
    //PushNotification.clearLocalNotification();

    // Define 9h tomorrow
    const date = new Date();
    const hour = date.getHours();
    if (hour > 9) date.setDate(date.getDate() + 1);
    date.setHours(9, 0, 0, 0);

    for (let _ = 0; _ < MAX_DAYS; _++) {
        const random = user.random(0, user.quotes.length - 1);
        const { Quote, Author } = user.quotes[random];

        PushNotification.localNotificationSchedule({
            channelId: CHANNEL_ID,
            title: langManager.curr['notifications']['text-title'],
            message: Quote + '(' + Author + ')',
            date: date
        });

        date.setDate(date.getDate() + 1);
    }
}

function disableNotificationSchedule() {
    PushNotification.deleteChannel(CHANNEL_ID);
}

export { enableNotificationSchedule, disableNotificationSchedule }