import { StyleSheet } from 'react-native';

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
        top: 130,
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
        marginBottom: 16,
        paddingVertical: 0,
        paddingHorizontal: 0
    }
});

export default styles;
