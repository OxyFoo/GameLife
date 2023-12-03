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
        height: 36,
        paddingHorizontal: 0,
        borderRadius: 8
    },
    buttonDelete: {
        position: 'absolute',
        bottom: 0,
        width: '40%',
        height: 36,
        paddingHorizontal: 0,
        borderRadius: 8
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
