import { Dimensions, StyleSheet } from 'react-native';

const smallScreen = Dimensions.get('window').height <= 900;

const styles = StyleSheet.create({
    pageHeader: {
        marginBottom: 12
    },

    editorAvatarHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        elevation: 100,
        paddingHorizontal: 24
    },
    avatarContainer: {
        position: 'absolute',
        top: 100,
        zIndex: -100,
        elevation: -100
    },

    slotsContainer: {
        position: 'absolute',
        top: smallScreen ? 100 : 120,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    slotButton: {
        width: 64,
        aspectRatio: 1,
        marginBottom: smallScreen ? 8 : 16,
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    colorSquare: {
        width: 64,
        height: 64,
        borderRadius: 6
    },
    oxContainer: {
        position: 'absolute',
        top: -40,
        left: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#38406573',
        borderRadius: 8
    },
    oxText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 6
    }
});

export default styles;
