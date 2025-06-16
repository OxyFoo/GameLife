import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import { PopupContent, statComponent } from './popup';
import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').Stats} Stats
 */

const StatsBarsProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Stats | null} */
    data: null,

    /** @type {boolean} */
    simplifiedDisplay: false,

    /** @type {Array<number>} Optionnal, add secondary value, same length of user stats */
    supData: user.experience.statsKey.map(() => 0)
};

class StatsBars extends React.PureComponent {
    render() {
        const { data, supData, style, simplifiedDisplay } = this.props;
        if (data === null) return null;

        const output = user.experience.statsKey.map((item, i) =>
            statComponent(item, data[item], supData[i], i, simplifiedDisplay, () => {
                user.interface.popup?.Open({
                    content: <PopupContent stats={data} initStatKey={item} />
                });
            })
        );

        return <View style={[styles.fullW, style]}>{output}</View>;
    }
}

StatsBars.prototype.props = StatsBarsProps;
StatsBars.defaultProps = StatsBarsProps;

export default StatsBars;
