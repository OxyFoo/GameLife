import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    checkButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 14,
        justifyContent: 'center',
        zIndex: 1
    },
    checkbox: {
        width: 24
    },

    buttonRight: {
        minHeight: 46,
        paddingVertical: 6,
        paddingLeft: 56,
        paddingRight: 12
    },
    buttonRightContent: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    titleView: {
        flex: 1
    },
    titleText: {
        fontSize: 16,
        textAlign: 'left'
    },

    todoContent: {
        paddingLeft: 4,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },

    todoDateText: {
        marginRight: 4,
        fontSize: 14,
        textAlign: 'right'
    },
    todoDateIcon: {
        marginRight: 12
    },

    trashButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'auto',
        paddingVertical: 0,
        paddingLeft: 12,
        paddingRight: 12,
        justifyContent: 'center'
    }
});

export default styles;
