import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        borderRadius: 20,

        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

        paddingHorizontal: 8,
        paddingVertical: 12
    },
    notEnoughData: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    notEnoughDataText: {
        fontSize: 16
    },
    notEnoughDataButton: {
        marginTop: 12,
        paddingVertical: 12
    }
});

export default styles;
