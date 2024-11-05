import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    flatListColumnWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    day: {
        width: '12%',
        aspectRatio: 2 / 3,
        justifyContent: 'center'
    },
    dayText: {
        paddingBottom: 2,
        fontSize: 16
    },
    dayBorder: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    dayBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 8
    }
});

export default styles;
