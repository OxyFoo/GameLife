import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    columnSide: {
        width: '15%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    columnMiddle: {
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    box: {
        width: '90%',
        padding: 0,
        paddingVertical: 0,
        paddingHorizontal: 0,
        aspectRatio: 1,
        marginVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },
    row: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    smallBox: {
        width: '10%',
        paddingHorizontal: '8%'
    },
    avatar: {
        width: '80%',
        aspectRatio: 1,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden'
    },
    avatarOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 16
    },

    editor: {
        position: 'absolute',
        padding: '5%',
        paddingTop: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        elevation: 100,
        overflow: 'hidden'
    },
    editorCurrent: {
        marginBottom: 12
    },
    editorClose: {
        position: 'absolute',
        top: 0,
        right: 12,
        zIndex: 100,
        elevation: 100
    },
    editorTitle: {
        marginBottom: 12,
        marginHorizontal: 24
    },
    editorText: {
        minHeight: 48,
        marginBottom: 12
    },

    editorStuffContainer: {
        paddingBottom: 36
    },

    editorStuffParent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24
    },
    editorStuffSellBtn: {
        width: '40%',
        paddingHorizontal: 4,
        borderRadius: 12
    },
    editorStuffEquipBtn: {
        width: '56%',
        borderRadius: 12
    },

    tempText: {
        position: 'absolute',
        top: 0,
        left: 12,
        right: 12,
        zIndex: 100,
        elevation: 100,
        fontSize: 12,
        transform: [{ rotate: '-90deg' }, { translateX: -80 }, { translateY: -70 }]
    }
});

export default styles;
