import * as React from 'react';

import BackActivityPage2StartNow from './back';
import styles from './style';
import langManager from 'Managers/LangManager';

import { Text, Button } from 'Interface/Components';

class AddActivityPage2StartNow extends BackActivityPage2StartNow {
    render() {
        const lang = langManager.curr['activity'];
        const { skillID } = this.props;

        if (!skillID) {
            return null;
        }

        return (
            <>
                {/* Start now */}
                <Text style={styles.title}>{lang['title-start-now']}</Text>
                <Button
                    style={styles.startNowButton}
                    fontColor='backgroundCard'
                    borderColor='border'
                    onPress={this.onAddActivityNow}
                >
                    {lang['button-start-now']}
                </Button>
            </>
        );
    }
}

export { AddActivityPage2StartNow };
