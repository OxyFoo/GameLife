import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    citation: {
        fontSize: 16,
        textAlign: 'justify'
    },
    author: {
        marginTop: 8,
        marginRight: 24,
        fontSize: 16,
        textAlign: 'right',
        fontWeight: 'bold'
    },

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

    quote: {
        padding: '5%'
    }
});

export default styles;
