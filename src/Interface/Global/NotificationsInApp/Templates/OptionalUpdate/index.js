import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import langManager from 'Managers/LangManager';

import { Button, Text } from 'Interface/Components';
import { OpenStore } from 'Utils/Store';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Class/NotificationsInApp').NotificationInApp<'optional-update'>} NotificationInAppOptionalUpdate
 */

/**
 * @param {object} props
 * @param {NotificationInAppOptionalUpdate} props.notif
 * @param {number} props.index
 * @returns {JSX.Element | null}
 */
function NIA_OptionalUpdate({ notif }) {
    const lang = langManager.curr['notifications']['in-app'];

    return (
        <View style={styles.container}>
            <View style={styles.text}>
                <Text fontSize={16}>{lang['optional-update-text'].replace('{}', notif.data.version)}</Text>
            </View>

            <View style={styles.buttons}>
                <Button style={styles.button} color='main1' onPress={OpenStore}>
                    {lang['optional-update-button']}
                </Button>
            </View>
        </View>
    );
}

export default NIA_OptionalUpdate;
