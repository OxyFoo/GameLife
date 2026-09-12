import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text } from '../../Components/Text';
import { Icon } from '../../Components/Icon';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidHit} RaidHit
 */

const RaidPointsMentionProps = {
    /** @type {RaidHit | null} Points previewed locally before the server answers */
    preview: /** @type {RaidHit | null} */ (null)
};

/**
 * Raid points brought by the activity that has just been added, under the success message.
 * Starts from the local preview and follows the server value (critical hit included).
 */
class RaidPointsMention extends React.Component {
    state = {
        /** @type {{ points: number, critical: boolean } | null} */
        hit: this.props.preview === null ? null : { points: this.props.preview.points, critical: false }
    };

    /** @type {Symbol | null} */
    listener = null;

    componentDidMount() {
        const last = user.raids.lastHit.Get();
        if (last !== null) {
            this.setState({ hit: last });
        }
        this.listener = user.raids.lastHit.AddListener((hit) => {
            if (hit !== null) {
                this.setState({ hit });
            }
        });
    }

    componentWillUnmount() {
        user.raids.lastHit.RemoveListener(this.listener);
        user.raids.lastHit.Set(null);
    }

    render() {
        const { hit } = this.state;
        if (hit === null || hit.points <= 0) {
            return null;
        }

        const lang = langManager.curr['raids'];
        return (
            <View style={styles.mention}>
                <Text fontSize={16} color='main2' bold>
                    {lang['points-signed'].replace('{}', hit.points.toString())}
                </Text>
                <Icon icon='swords' size={18} color='raid' />
                {hit.critical && <Icon icon='bolt' size={18} color='raid' />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mention: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 4
    }
});

RaidPointsMention.defaultProps = RaidPointsMentionProps;
RaidPointsMention.prototype.props = RaidPointsMentionProps;

export { RaidPointsMention };
