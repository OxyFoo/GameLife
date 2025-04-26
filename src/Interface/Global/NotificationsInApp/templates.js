import * as React from 'react';
import { Animated } from 'react-native';

import NIA_GlobalMessage from './Templates/GlobalMessage';
import NIA_FriendPending from './Templates/FriendPending';
import NIA_AchievementPending from './Templates/AchievementPending';
import NIA_OptionalUpdate from './Templates/OptionalUpdate';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInAppTypes} NotificationInAppTypes
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInApp<NotificationInAppTypes>} NotificationInApp
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInApp<'global-message'>} NotificationInAppGlobalMessage
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInApp<'friend-pending'>} NotificationInAppFriendPending
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInApp<'achievement-pending'>} NotificationInAppAchievementPending
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInApp<'optional-update'>} NotificationInAppOptionalUpdate
 */

/**
 * @param {object} props
 * @param {NotificationInApp} props.item
 * @param {number} props.index
 * @returns {React.JSX.Element | null}
 */
function NIA_Template({ item, index }) {
    const [fadeAnim] = React.useState(new Animated.Value(1));

    // Animation on mount
    React.useEffect(() => {
        setTimeout(() => {
            SpringAnimation(fadeAnim, 0).start();
        }, index * 50);
    });

    const animStyle = {
        transform: [{ translateX: Animated.multiply(500, fadeAnim) }]
    };

    // Render the correct notification type
    let content;
    switch (item.type) {
        case 'friend-pending':
            const notifFriend = /** @type {NotificationInAppFriendPending} */ (item);
            content = <NIA_FriendPending notif={notifFriend} index={index} />;
            break;

        case 'achievement-pending':
            const notifAchievement = /** @type {NotificationInAppAchievementPending} */ (item);
            content = <NIA_AchievementPending notif={notifAchievement} index={index} />;
            break;

        case 'global-message':
            const notifGlobalMessage = /** @type {NotificationInAppGlobalMessage} */ (item);
            content = <NIA_GlobalMessage notif={notifGlobalMessage} index={index} />;
            break;

        case 'optional-update':
            const notifOptionalUpdate = /** @type {NotificationInAppOptionalUpdate} */ (item);
            content = <NIA_OptionalUpdate notif={notifOptionalUpdate} index={index} />;
            break;

        default:
            return null;
    }

    return <Animated.View style={animStyle}>{content}</Animated.View>;
}

export { NIA_Template };
