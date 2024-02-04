import * as React from 'react';
import { View } from 'react-native';

import { Text } from 'Interface/Components';

/**
 * @typedef {import('Types/NotificationInApp').NotificationInApp<'friend-pending'>} NotificationInApp
 */

/**
 * TODO: Frontend
 * @param {object} props
 * @param {NotificationInApp} props.notif
 * @param {number} props.index
 * @returns {JSX.Element}
 */
function NIA_AchievementPending({ notif, index }) {
    return (
        <View>
            <Text>Achievement pending</Text>
        </View>
    );
}

export default NIA_AchievementPending;
