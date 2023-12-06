import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    containerStyle: {
        width: 46,
        height: 32,
        paddingLeft: 7,
        justifyContent: 'center',

        borderColor: '#FFFFFF',
        borderWidth: 2,
        overflow: 'hidden'
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    digit: {
        marginHorizontal: 2,
        fontSize: 18
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
