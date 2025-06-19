import { StyleSheet } from 'react-native';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').TextStyle} TextStyle
 * @typedef {import('react-native').ImageStyle} ImageStyle
 * @typedef {ViewStyle | TextStyle | ImageStyle} AnyStyle
 */

const styles = StyleSheet.create({
    test: {
        color: 'red'
    },
    /**
     * @param {string} borderColor
     * @param {string} backgroundColor
     * @returns {AnyStyle}
     */
    list: (borderColor, backgroundColor) => ({
        display: 'flex',
        alignContent: 'flex-start',
        backgroundColor,
        borderWidth: 2,
        borderColor,
        borderRadius: 8
    }),
    /**
     * @param {string} backgroundColor
     * @returns {AnyStyle}
     */
    itemContainer: (backgroundColor) => ({
        backgroundColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12
    }),
    /**
     * @param {string} color
     * @param {boolean} isSelected
     * @returns {AnyStyle}
     */
    itemText: (color, isSelected) => ({
        color,
        fontWeight: isSelected ? '700' : 'normal'
    })
});

export default styles;
