import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        width: '100%',
        height: 96,
        bottom: 48,
        left: 0,
        paddingTop: 48,
        alignItems: 'center'
    },
    body: {
        flex: 1,
        width: '80%',
        minWidth: 260,
        maxWidth: 320,
        borderRadius: 20,
        flexDirection: 'row',
        backgroundColor: '#03052E'
    },
    button: {
        flex: 1,
        height: '100%',
        borderRadius: 0,
        justifyContent: 'center'
    },
    btFirst: {
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20
    },
    btMiddleParent: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 24,
        alignItems: 'center'
    },
    btMiddle: {
        height: '100%',
        aspectRatio: 1,
    },
    btLast: {
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
    },

    bar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '11%',
        height: 4,
        marginLeft: '3%',
        borderRadius: 8
    }
});

export default styles;
