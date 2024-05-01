import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        height: '100%',
        width: '100%',
        padding: 32,
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    flagsContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    flagRow: {
        marginVertical: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    flagText: {
        marginLeft: 16
    },

    buttonNext: {
        width: '60%',
        minWidth: 125
    }
});

export default styles;
