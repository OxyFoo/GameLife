import * as React from 'react';
import { Animated } from 'react-native';

import styles from './style';
import NIA_FriendPending from './friendPending';
import NIA_AchievementPending from './achievementPending';
import langManager from 'Managers/LangManager';

import { Text, Separator } from 'Interface/Components';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Types/NotificationInApp').NotificationInApp} NotificationInApp
 */

/**
 * @param {object} props
 * @param {NotificationInApp} props.item
 * @param {number} props.index
 * @returns {JSX.Element}
 */
function NIA_Template({ item, index }) {
    const [ fadeAnim ] = React.useState(new Animated.Value(1));

    // Animation on mount
    React.useEffect(() => {
        setTimeout(() => {
            SpringAnimation(fadeAnim, 0).start();
        }, index * 50);
    }, []);

    const animStyle = {
        transform: [
            { translateX: Animated.multiply(500, fadeAnim) }
        ]
    };

    // Render the correct notification type
    let content;
    if (item.type === 'friend-pending') {
        content = <NIA_FriendPending notif={item} index={index} />;
    } else if (item.type === 'achievement-pending') {
        content = <NIA_AchievementPending notif={item} index={index} />;
    } else {
        return null;
    }

    return (
        <Animated.View style={animStyle}>
            {content}
        </Animated.View>
    );
}

/**
 * @returns {JSX.Element}
 */
function NIA_Separator() {
    const [ fadeAnim ] = React.useState(new Animated.Value(0));

    // Animation on mount
    React.useEffect(() => {
        setTimeout(() => {
            SpringAnimation(fadeAnim, 1).start();
        }, 100);
    }, []);

    const animStyle = {
        opacity: fadeAnim
    };

    return (
        <Animated.View style={animStyle}>
            <Separator.Horizontal style={styles.separator} />
        </Animated.View>
    );
}

function NIA_Empty() {
    const lang = langManager.curr['notifications-in-app'];

    return (
        <Text>{lang['list-empty']}</Text>
    );
}

export { NIA_Template, NIA_Separator, NIA_Empty };
