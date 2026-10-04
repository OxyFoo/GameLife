import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 24,
        paddingTop: '12%',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },

    container: {
        width: '100%',
        alignItems: 'center'
    },

    textContainer: {
        alignItems: 'center',
        marginBottom: 24
    },
    subtitle: {
        marginTop: 4,
        textTransform: 'uppercase'
    },

    // The copy in its frame, like the item reward
    frameContainer: {
        aspectRatio: 1,
        width: '60%'
    },
    frame: {
        width: '100%',
        height: '100%',
        borderWidth: 4,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    avatarFrame: {
        transform: [{ scale: 2 }]
    },
    frameFooter: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 12,
        alignItems: 'center',
        gap: 4
    },

    // The step and the price, the dark translucent panel of the raid card
    card: {
        width: '100%',
        marginTop: 24,
        borderRadius: 16,
        overflow: 'hidden'
    },
    cardBorder: {
        borderWidth: 1.5,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center'
    },
    transitionRow: {
        alignItems: 'center',
        gap: 4
    },
    separator: {
        marginVertical: 12
    },
    costRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    failureText: {
        marginTop: 12,
        textAlign: 'center'
    },

    buttons: {
        width: '100%',
        gap: 12
    }
});

export default styles;
