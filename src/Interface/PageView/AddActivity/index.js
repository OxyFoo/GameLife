import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackActivity from './back';
import { AddActivityPage1 } from './Page1';
import { AddActivityPage2 } from './Page2';

class AddActivity extends BackActivity {
    render() {
        const { categoryID, listSkillsIDs, editActivity } = this.props;
        const { newActivity } = this.state;

        return (
            <View style={styles.parent}>
                <AddActivityPage1
                    nativeRef={this.nativeRefPage1}
                    show={newActivity.skillID === 0}
                    activity={newActivity}
                    changeActivity={this.changeActivity}
                    unSelectActivity={this.unSelectActivity}
                    categoryID={categoryID}
                    listSkillsIDs={listSkillsIDs}
                />
                <AddActivityPage2
                    ref={this.refChild2}
                    nativeRef={this.nativeRefPage2}
                    show={newActivity.skillID !== 0}
                    activity={newActivity}
                    editActivity={editActivity}
                    changeActivity={this.changeActivity}
                    unSelectActivity={this.unSelectActivity}
                />
            </View>
        );
    }
}

export { AddActivity };
