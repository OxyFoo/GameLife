import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    containerStyle: {
        width: 46,
        paddingVertical: 4,
        justifyContent: 'center',

        borderWidth: 2,
        borderRadius: 8,
        borderColor: '#FFFFFF',
        overflow: 'hidden'
    },
    content: {
        flexDirection: 'row'
    },
    digit: {
        marginRight: 4,
        fontSize: 18,
        textAlign: 'center'
    },
    gradient: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: -1,
        right: -1
    }
});

export default styles;
