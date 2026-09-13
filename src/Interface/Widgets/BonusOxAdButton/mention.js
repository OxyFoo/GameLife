import * as React from 'react';
import { View } from 'react-native';

import styles from './style';

import { OxAmount } from '../../Components/OxAmount';

/**
 * @typedef {import('Utils/DynamicVar').default<number>} BonusOxVar
 */

const BonusOxMentionProps = {
    /** @type {number} Ox the activity brought on its own */
    baseOx: 0,

    /** @type {BonusOxVar | null} Ox granted by the ad, 0 until it has been watched */
    bonusOx: null
};

/**
 * Ox brought by the activity, shown under the success message of the display page.
 *
 * It watches the ad bonus rather than taking a number, because the `args` of the `display` page are
 * captured once by `ChangePage`: a plain element could never follow the reward.
 */
class BonusOxMention extends React.Component {
    state = {
        bonus: 0
    };

    /** @type {Symbol | null} */
    listener = null;

    componentDidMount() {
        const { bonusOx } = this.props;
        if (bonusOx !== null) {
            this.listener = bonusOx.AddListener((bonus) => this.setState({ bonus }));
        }
    }

    componentWillUnmount() {
        this.props.bonusOx?.RemoveListener(this.listener);
    }

    render() {
        const total = this.props.baseOx + this.state.bonus;

        return (
            <View style={styles.mention}>
                <OxAmount value={total} signed fontSize={18} iconSize={24} />
            </View>
        );
    }
}

BonusOxMention.defaultProps = BonusOxMentionProps;
BonusOxMention.prototype.props = BonusOxMentionProps;

export { BonusOxMention };
