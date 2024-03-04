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
    }
});

export default styles;
