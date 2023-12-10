import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    parent: {
        height: 32,
        marginTop: 14,
        overflow: 'hidden'
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        flex: 1,
        height: '100%',
        justifyContent: 'center'
    },
    titleText: {
        height: 24,
        textAlign: 'left'
    },
    dateText: {
        textAlign: 'right',
        fontSize: 12,
        marginBottom: 2
    },
    checkbox: {
        width: 32,
        aspectRatio: 1,
        marginRight: 16,
        paddingHorizontal: 0,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8
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
