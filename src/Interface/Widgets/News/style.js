import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
    }
});

export default styles;
