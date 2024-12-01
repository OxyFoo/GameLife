import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },

    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        textAlign: 'left',
        fontSize: 21
    },
    tasksChecked: {
        textAlign: 'left',
        fontSize: 16,
        marginLeft: 4
    },
    smallButton: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    },

    task: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    taskTextParent: {
        flex: 1,
        paddingHorizontal: 6
    },
    taskText: {
        textAlign: 'left',
        fontSize: 14
    },
    taskDetails: {
        flexDirection: 'row',
        alignItems: 'center'
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
    }
});

export default styles;
