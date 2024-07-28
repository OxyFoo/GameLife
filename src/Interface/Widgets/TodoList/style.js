import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    todoesContainer: {
        padding: 28,
        paddingTop: 14
    },
    todoButton: {
        marginBottom: 8
    },

    emptyText: {
        marginBottom: 12
    },
    emptyButton: {
        borderRadius: 6,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
    },

    selection: {
        position: 'absolute',
        top: 0,
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
