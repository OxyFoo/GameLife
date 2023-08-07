import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {import('./script').DayType} DayType
 * @typedef {import('./script').MonthType} MonthType
 */

const dynamicStyles = {
    bgMain1: { backgroundColor: themeManager.GetColor('main1') },
    bgMain2: { backgroundColor: themeManager.GetColor('main2') },
    bgBorder: { backgroundColor: themeManager.GetColor('border') }
};

const BlockDayProps = {
    /** @type {DayType|null} */
    item: null,

    onPress: () => {}
}

class BlockDay extends React.Component {
    isActivity = false;
    isActivityXP = false;

    shouldComponentUpdate(nextProps) {
        const { item } = nextProps;
        const { item: currItem } = this.props;

        if (item?.isActivity !== currItem?.isActivity ||
            item?.isActivityXP !== currItem?.isActivityXP ||
            item?.isSelected !== currItem?.isSelected ||
            item?.isActivity !== this.isActivity ||
            item?.isActivityXP !== this.isActivityXP) {
                this.isActivity = item?.isActivity;
                this.isActivityXP = item?.isActivityXP;
                return true;
        }

        return false;
    }

    render() {
        const { item, onPress } = this.props;
        if (item === null) return <View style={styles.day} />;

        const { day, isToday, isSelected, isActivity, isActivityXP } = item;
        const dotColor = isActivityXP ? dynamicStyles.bgMain2 : dynamicStyles.bgMain1;

        /** @type {Array<StyleProp>} */
        let style = [styles.day];
        if (isSelected)   style = [...style, styles.circle, dynamicStyles.bgMain1];
        else if (isToday) style = [...style, styles.circle, dynamicStyles.bgMain2];

        return (
            <View style={style}>

                {day !== 0 && (
                    <Text
                        containerStyle={styles.dayTextContainer}
                        onPress={onPress}
                    >
                        {day.toString()}
                    </Text>
                )}

                {(isActivity || isActivityXP) && (
                    <View style={styles.dotContainer}>
                        <View style={[styles.dot, dotColor]} />
                    </View>
                )}

            </View>
        );
    }
}

BlockDay.prototype.props = BlockDayProps;
BlockDay.defaultProps = BlockDayProps;

export default BlockDay;