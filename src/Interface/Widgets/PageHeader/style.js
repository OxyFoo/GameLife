import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        width: '100%',
        marginTop: 36,
        marginBottom: 36,

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        elevation: 1000,
        zIndex: 1000
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerLeftArrow: {
        marginRight: 16
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold'
    }
});

export default styles;
