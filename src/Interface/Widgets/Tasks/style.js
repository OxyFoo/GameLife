import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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

    tasksContainer: {
        padding: 28,
        paddingTop: 14
    },
    spaceBottom: {
        marginBottom: 32
    },
    emptyText: {
        marginBottom: 12
    },
    adButton: {
        justifyContent: 'space-between',
        borderRadius: 14
    },
    adText: {
        marginRight: 6
    },
    adIcon: {
        flexDirection: 'row'
    }
});

export default styles;