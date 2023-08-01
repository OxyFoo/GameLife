import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconContainer: {
        width: 50,
        minHeight: 50,

        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 25
    },
    text: {
        flex: 1,
        marginLeft: 12,
        marginRight: 12,
        alignItems: 'flex-start',
        justifyContent: 'space-evenly'
    },
    dotContainer: {
        width: 20,
        alignSelf: 'stretch',

        alignItems: 'center',
        justifyContent: 'center'
    },
    dot: {
        width: 20,
        height: 20,

        borderWidth: 2,
        borderRadius: 10
    },
    separator: {
        alignItems: 'center',
        justifyContent: 'center',

        height: 72,
        width: '100%',
        marginLeft: 25,
        marginRight: 25,
        borderLeftWidth: 3,
        borderStyle: 'dashed'
    },
    button: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 4
    }
});

export default styles;