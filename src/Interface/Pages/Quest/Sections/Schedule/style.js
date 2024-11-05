import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    hintText: {
        marginTop: 12
    },
    selectorButtonWeekDay: {
        flex: 1,
        aspectRatio: 3 / 4,
        justifyContent: 'center',
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    selectorButtonMonthDay: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent'
    },

    daysFlatlist: {
        marginTop: 12
    },
    daysColumnWrapperStyle: {
        flex: 1
    },
    daysContentContainerStyle: {
        justifyContent: 'space-between'
    },
    separator: {
        height: 4
    },

    frequencyContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    frequencyDigit: {
        width: 80,
        borderWidth: 1.5
    },
    frequencySeparator: {
        marginHorizontal: 8,
        fontSize: 34,
        textAlignVertical: 'center'
    },
    frequencyComboBox: {
        width: 'auto'
    },
    frequencyComboBoxInput: {
        minHeight: 42,
        paddingLeft: 16,
        paddingRight: 42,
        paddingVertical: 0
    }
});

export default styles;
