import * as React from 'react';
import styles from './style';
import BackBonusOxAdButton from './back';
import langManager from 'Managers/LangManager';

import { Text } from '../../Components/Text';
import { Icon } from '../../Components/Icon';
import { Button } from '../../Components/Button';

class BonusOxAdButton extends BackBonusOxAdButton {
    render() {
        const lang = langManager.curr['activity'];
        const { oxBonusPreview } = this.props;
        const { adState } = this.state;

        // Nothing to offer: the ad is gone, unavailable, or already watched
        if (adState === 'error' || adState === 'notAvailable' || adState === 'watched') {
            return null;
        }

        return (
            <Button
                style={styles.button}
                styleContent={styles.content}
                appearance='normal'
                gradientColors={['#8C1AFF', '#B24DFF']}
                fontSize={14}
                loading={adState === 'wait'}
                onPress={this.openAd}
            >
                <Icon icon='play' color='white' size={20} />
                <Text fontSize={14} bold>
                    {lang['display-activity-bonus-ad'].replace('{}', oxBonusPreview.toString())}
                </Text>
            </Button>
        );
    }
}

export { BonusOxAdButton };
export { BonusOxMention } from './mention';
