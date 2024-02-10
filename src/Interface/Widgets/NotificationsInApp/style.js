import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // NotificationsInAppButton bell & badge
    container: {
        width: 48,
        height: 48,
        aspectRatio: 1,
        paddingHorizontal: 0,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000050'
    },
    button: {
        height: 'auto',
        paddingHorizontal: 0,
        borderRadius: 0
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 20,
        height: 20,
        borderRadius: 100
    }
});

export default styles;
