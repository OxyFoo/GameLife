import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    list: {
        alignItems: 'flex-start'
    },
    compact: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 4
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    rowCompact: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 5,
        marginRight: 6,
        minWidth: 44,
        alignItems: 'center',
        justifyContent: 'center'
    },
    badgeCompact: {
        paddingHorizontal: 4,
        marginRight: 3,
        minWidth: 0
    },
    label: {
        textAlign: 'left'
    }
});

export default styles;
