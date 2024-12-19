import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    console: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center'
    },
    content: {
        width: '100%',
        height: 256,
        marginBottom: 24,
        padding: 24,
        backgroundColor: '#000'
    },
    text: {
        textAlign: 'left'
    },
    buttonOpen: {
        width: '40%',
        paddingVertical: 8,
        paddingHorizontal: 0,
        borderRadius: 8
    },
    buttonFeature: {
        flex: 1,
        width: 'auto',
        marginHorizontal: 6,
        paddingVertical: 8,
        paddingHorizontal: 0,
        borderRadius: 8
    },
    buttonAbsoluteLeft: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        marginHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    buttonAbsoluteRight: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        marginHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    buttonClose: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 60,
        borderRadius: 0,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16
    }
});

export default styles;
