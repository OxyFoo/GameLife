import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackActivity from './back';
import { AddActivityPage1 } from './Page1';
import { AddActivityPage2 } from './Page2';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

class AddActivity extends BackActivity {
    render() {
        const { categoryID, listSkillsIDs } = this.props;
        const { newActivity } = this.state;

        return (
            <View style={styles.parent}>
                {newActivity.skillID === 0 ? (
                    <AddActivityPage1
                        activity={newActivity}
                        changeActivity={this.changeActivity}
                        unSelectActivity={this.unSelectActivity}
                        categoryID={categoryID}
                        listSkillsIDs={listSkillsIDs}
                    />
                ) : (
                    <AddActivityPage2
                        activity={newActivity}
                        changeActivity={this.changeActivity}
                        unSelectActivity={this.unSelectActivity}
                    />
                )}
            </View>
        );
    }
}

export { AddActivity };
