import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    buttonLeft: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    },

    buttonRight: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 6
    },
    buttonRightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    contentLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    contentRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    dateText: {
        marginRight: 4,
        fontSize: 16
    },
    dateIcon: {
        marginRight: 12
    },
    trashButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 32,
        height: 'auto'
    },

    // Tasks
    parentTask: {
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: '100%',
        borderColor: '#fff',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderBottomRightRadius: 8
    },

    // Selection
    selection: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingVertical: 4,
        marginHorizontal: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#00000080',
        zIndex: 10
    },
    selectionTodo: {
        marginTop: 0
    }
});

export default styles;
