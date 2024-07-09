import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 6,
        paddingHorizontal: 24,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    absolute: {
        position: 'absolute'
    },
    buttonParent: {
        flex: 1,
        height: '100%'
    },
    button: {
        height: '100%',
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContent: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 12
    },

    middleParentButton: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    middleButton: {
        width: '80%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 0,
        borderRadius: 100,
        borderWidth: 4
    }
});

export default styles;
