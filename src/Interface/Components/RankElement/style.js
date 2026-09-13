import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    itemContainer: {
        marginVertical: 2,
        width: '100%',
        borderRadius: 10,
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    itemGradient: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden'
    },
    innerGradient: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10
    },
    frameBorder: {
        width: 48,
        height: 48,
        aspectRatio: 1,
        borderRadius: 6,
        borderWidth: 2,
        overflow: 'hidden'
    },
    textContainer: {
        flex: 1,
        marginLeft: 12
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    details: {
        textAlign: 'left',
        fontSize: 12
    },
    rankContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 6,
        minWidth: 56
    },
    rankText: {
        fontSize: 16
    },
    trendSame: {
        fontSize: 14,
        width: 14,
        textAlign: 'center'
    }
});

export default styles;
