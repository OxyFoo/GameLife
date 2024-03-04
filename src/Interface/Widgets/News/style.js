import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // News render
    new: {
        padding: '5%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    separator: {
        width: 0,
        height: '100%',
        marginHorizontal: 12
    },
    newInteraction: {
        flex: 1
    },
    newButton: {
        height: 48,
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
        marginBottom: 20
    },

    // MyQuest render
    mqContainer: {
        marginBottom: 16
    },
    mqTitle: {
        marginTop: 8,
        marginRight: 8
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
