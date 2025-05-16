import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 *
 * @typedef {import('./script').DayType} DayType
 */

const dynamicStyles = {
    bgMain1: { backgroundColor: themeManager.GetColor('main1') },
    bgMain2: { backgroundColor: themeManager.GetColor('main2') }
};

const DayProps = {
    /** @type {DayType | null} */
    item: null,

    /** @type {(item: DayType | null) => void} */
    onPress: () => {}
};

class Day extends React.PureComponent {
    onPress = () => {
        const { item, onPress } = this.props;
        onPress(item);
    };

    render() {
        const { item } = this.props;
        if (item === null) return <View style={styles.day} />;

        const { day, isToday, isSelected, isActivity, isActivityXP } = item;

        let bakStyle;
        if (isSelected) bakStyle = dynamicStyles.bgMain1;
        else if (isToday) bakStyle = dynamicStyles.bgMain2;

        let dotStyle;
        if (isActivityXP) dotStyle = dynamicStyles.bgMain1;
        else if (isActivity) dotStyle = dynamicStyles.bgMain2;

        const styleParent = [styles.day, styles.circle, bakStyle];

        return (
            <View style={styleParent}>
                {day !== 0 && (
                    <Text containerStyle={styles.dayTextContainer} onPress={this.onPress}>
                        {day.toString()}
                    </Text>
                )}

                {(isActivity || isActivityXP) && (
                    <View style={styles.dotContainer}>
                        <View style={[styles.dot, dotStyle]} />
                    </View>
                )}
            </View>
        );
    }
}

Day.prototype.props = DayProps;
Day.defaultProps = DayProps;

export default Day;
