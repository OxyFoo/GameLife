import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // NotificationsInAppButton bell & badge
    button: {
        width: 48,
        height: 48,
        paddingHorizontal: 0,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 6,
        height: 6,
        justifyContent: 'center',
        borderRadius: 100
    },
    badgeMask: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    badgeDarkClone: {
        transform: [{ scale: 1.4 }],
        backgroundColor: 'black'
    }
});

export default styles;
