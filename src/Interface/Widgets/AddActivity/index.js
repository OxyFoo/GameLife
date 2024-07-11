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
        const { selectedSkill } = this.state;

        return (
            <View style={styles.parent}>
                {selectedSkill === null ? (
                    <AddActivityPage1 selectActivity={this.selectSkill} />
                ) : (
                    <AddActivityPage2
                        skillID={selectedSkill}
                        onChangeDuration={this.onChangeDuration}
                        unSelectSkill={this.unSelectSkill}
                    />
                )}
            </View>
        );
    }
}

export { AddActivity };
