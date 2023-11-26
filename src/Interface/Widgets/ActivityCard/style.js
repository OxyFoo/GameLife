import { Platform, StyleSheet } from 'react-native';

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

        width: '100%',
        minHeight: 48,
        marginLeft: 23.5, // imageWidth / 2 - borderWidth / 2
        marginRight: 23.5,
        borderLeftWidth: 3,
        borderStyle: Platform.OS === 'android' ? 'dashed' : 'solid'
    },
    button: {
        marginVertical: 16,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 4
    }
});

export default styles;
