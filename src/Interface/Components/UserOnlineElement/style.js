import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    friend: {
        width: '100%',
        height: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 0
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'left'
    },
    friendInfoTitle: {
        marginLeft: 8,
        alignItems: 'flex-start'
    },
    friendDetails: {
        aspectRatio: 1,
        width: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: '#00000050'
    },
    frame: {
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    frameBorder: {
        width: 48,
        height: 48,
        aspectRatio: 1,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#00000050'
    },
    level: {
    }
});

export default styles;
