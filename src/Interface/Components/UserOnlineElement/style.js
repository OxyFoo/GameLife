import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    friendButton: {
        width: '100%',
        height: 'auto',
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    friendGradient: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 4,
        paddingHorizontal: 8
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'left'
    },
    friendInfoTitle: {
        marginLeft: 12,
        alignItems: 'flex-start'
    },
    title: {
        marginTop: -2
    },
    frame: {
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    frameBorder: {
        width: 42,
        height: 42,
        aspectRatio: 1,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#00000050'
    },
    friendTopPlaceholder: {
        width: '100%',
        height: '100%'
    },
    details: {
        flexDirection: 'row'
    },
    level: {
        marginRight: 12
    }
});

export default styles;
