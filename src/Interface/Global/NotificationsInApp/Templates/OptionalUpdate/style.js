import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 12
    },
    text: {
        width: '65%',
        justifyContent: 'center'
    },
    buttons: {
        width: '35%',
        paddingLeft: 12
    },
    button: {
        height: '100%',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 0
    }
});

export default styles;
