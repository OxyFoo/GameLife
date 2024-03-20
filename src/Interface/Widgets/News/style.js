import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // News render
    new: {
        padding: 12,
        paddingBottom: 24,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    newInteraction: {
        flex: 1
    },
    newButton: {
        minWidth: 72,
        height: 'auto',
        marginTop: 8,
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    newText: {
        flex: 2
    },
    newIcon: {
        flex: .6,
        alignItems: 'center',
        justifyContent: 'center'
    },

    // NZD render
    nzdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    nzdTitle: {
        marginVertical: 8,
        marginRight: 8
    },
    nzdItem: {
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: 'transparent'
    },

    // MyQuest render
    mqContainer: {
        marginBottom: 16
    },
    mqContainerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mqTitle: {
        marginVertical: 4,
        marginRight: 4
    },
    mqItem: {
        height: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 12,
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    headerStreak: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mqDayClock: {
        marginRight: 16
    },
    streak: {
        height: 24,
        marginRight: 8,
        textAlign: 'left'
    },
    mqSeparator: {
        width: '80%',
        height: .5,
        marginHorizontal: '10%',
        opacity: .5
    }
});

export default styles;
