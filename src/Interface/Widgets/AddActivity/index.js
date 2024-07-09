import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackActivity from './back';
import { AddActivityPage1 } from './Page1';
import { AddActivityPage2 } from './Page2';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('./types').ItemSkill} ItemSkill
 * @typedef {import('./types').ItemCategory} ItemCategory
 */

class AddActivity extends BackActivity {
    render() {
        return (
            <View style={styles.parent}>
                {/* <AddActivityPage1 /> */}
                <AddActivityPage2 />
            </View>
        );
    }
}

export { AddActivity };
